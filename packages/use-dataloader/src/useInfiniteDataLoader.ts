// oxlint-disable eslint/max-statements

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StatusEnum } from './constants'
import type DataLoader from './dataloader'
import { useDataLoaderContext } from './DataLoaderProvider'
import { marshalQueryKey } from './helpers'
import type { KeyType, PromiseType, UseInfiniteDataLoaderConfig, UseInfiniteDataLoaderResult } from './types'

/**
 * This hook can be used for promises that have a "Load More" so page change but we want to keep the previous data and append the next one
 */
export const useInfiniteDataLoader = <
  ResultType = unknown,
  ErrorType extends Error = Error,
  ParamsType extends Record<string, unknown> = Record<string, unknown>,
  ParamsPageKey extends keyof ParamsType = keyof ParamsType,
>(
  baseKey: KeyType,
  method: (params: ParamsType) => PromiseType<ResultType>,
  baseParams: ParamsType,
  pageParamKey: ParamsPageKey,
  config?: UseInfiniteDataLoaderConfig<ResultType, ErrorType, ParamsType, ParamsPageKey>,
): UseInfiniteDataLoaderResult<ResultType, ErrorType> => {
  const { getOrAddRequest, computeKey, onError: onGlobalError, defaultDatalifetime } = useDataLoaderContext()

  const {
    enabled = true,
    onError,
    onSuccess,
    keepPreviousData = false,
    initialData,
    dataLifetime,
    getNextPage,
  } = config ?? {}

  const computedDatalifetime = dataLifetime ?? defaultDatalifetime
  const requestRefs = useRef<DataLoader<ResultType, ErrorType>[]>([])
  const [page, setPage] = useState(baseParams[pageParamKey])
  const [nextPage, setNextPage] = useState<typeof page | undefined>(page)
  const loadMoreBaseKeyRef = useRef<string | undefined>(undefined)
  const baseQueryKey = useMemo(() => marshalQueryKey(baseKey), [baseKey])
  const lastSyncedBaseKeyRef = useRef<string>(baseQueryKey)
  const isPageStale = lastSyncedBaseKeyRef.current !== baseQueryKey
  const paramsArgs = {
    ...baseParams,
    [pageParamKey]: isPageStale ? baseParams[pageParamKey] : page,
  }

  const getMethodRef = useRef(async () => method(paramsArgs))
  const getOnSuccessRef = useRef(async (...params: Parameters<NonNullable<typeof onSuccess>>) => onSuccess?.(...params))
  const getOnErrorRef = useRef(async (err: ErrorType) => onError?.(err) ?? onGlobalError?.(err))

  const [, setCounter] = useState(0)

  const forceRerender = useRef(() => {
    setCounter(current => current + 1)
  })

  useEffect(() => {
    const notifyFn = forceRerender.current
    // Ensure observers are added after first mount
    for (const request of requestRefs.current) {
      if (!request.observers.includes(notifyFn)) {
        request.addObserver(notifyFn)
      }
    }

    return () => {
      for (const request of requestRefs.current) {
        if (!request.observers.includes(notifyFn)) {
          request.removeObserver(notifyFn)
        }
      }
    }
  }, [])

  const getCurrentRequest = () => {
    const effectivePage = isPageStale ? baseParams[pageParamKey] : page
    const currentQueryKey = marshalQueryKey([baseQueryKey, 'infinite', effectivePage as string | number])

    // Clean bad requests in the array
    requestRefs.current = requestRefs.current.filter(request => {
      if (isPageStale) {
        const initialPageKey = marshalQueryKey([baseQueryKey, 'infinite', baseParams[pageParamKey] as string | number])
        if (request.key.endsWith(initialPageKey)) {
          return true
        }
        request.removeObserver(forceRerender.current)
        return false
      }

      if (request.key.startsWith(computeKey(baseQueryKey))) {
        return true
      }

      request.removeObserver(forceRerender.current)

      return false
    })

    const requestInRef = requestRefs.current.find(request => request.key.endsWith(currentQueryKey))

    if (!requestInRef) {
      const request = getOrAddRequest<ResultType, ErrorType>(currentQueryKey, {
        enabled,
        method: getMethodRef.current,
      })

      if (!request.observers.includes(forceRerender.current)) {
        request.addObserver(forceRerender.current)
      }
      requestRefs.current.push(request)

      return request
    }

    return requestInRef
  }

  const request = getCurrentRequest()

  // Compute nextPage from current request.data during render to avoid stale closures
  if (request.data) {
    const computedNextPage = getNextPage ? getNextPage(request.data, paramsArgs) : undefined
    if (computedNextPage !== nextPage) {
      setNextPage(computedNextPage)
    }
  }

  const needLoad = useMemo(
    () =>
      !!(
        enabled &&
        (!(request.dataUpdatedAt && computedDatalifetime) ||
          (request.dataUpdatedAt && computedDatalifetime && request.dataUpdatedAt + computedDatalifetime < Date.now()))
      ),
    [enabled, request.dataUpdatedAt, computedDatalifetime],
  )

  const optimisticIsLoadingRef = useRef(needLoad)
  const previousDataRef = useRef(request.data)

  // isFetching is true when there is an active request in progress
  const isFetching = requestRefs.current.some(
    req => req.status === StatusEnum.LOADING || optimisticIsLoadingRef.current,
  )
  // Current request is loading and its the first request added in the refs
  const isLoadingFirstPage =
    (request.status === StatusEnum.LOADING || optimisticIsLoadingRef.current) && requestRefs.current.length <= 1
  const isSuccess = request.status === StatusEnum.SUCCESS
  const isError = request.status === StatusEnum.ERROR
  const isIdle = requestRefs.current.every(req => req.status === StatusEnum.IDLE && !enabled)
  const computedData =
    isLoadingFirstPage || [...requestRefs.current].filter(dataloader => !!dataloader.data).length === 0
      ? initialData
      : [...requestRefs.current]
          .map(dataloader => dataloader.data)
          .filter((data): data is NonNullable<typeof data> => !!data)
  // isLoading is true only when there is no cache data and we're fetching data for the first time
  const isLoading = !computedData && request.isFirstLoading && request.status === StatusEnum.LOADING

  const reload = useCallback(async () => {
    await Promise.all(
      requestRefs.current.map(async req => req.load(true).then(getOnSuccessRef.current).catch(getOnErrorRef.current)),
    )
  }, [])

  const loadMore = useCallback(() => {
    if (nextPage) {
      loadMoreBaseKeyRef.current = baseQueryKey
      setPage(() => {
        if (loadMoreBaseKeyRef.current !== baseQueryKey) {
          return baseParams[pageParamKey]
        }
        return nextPage
      })
    }
  }, [nextPage, baseQueryKey, baseParams, pageParamKey])

  useEffect(() => {
    request.method = async () => method(paramsArgs)
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [method, request])

  useEffect(() => {
    if (keepPreviousData) {
      previousDataRef.current = request.data
    }
  }, [request.data, keepPreviousData])

  // Reset page when baseParams or pageParamKey change
  useEffect(() => {
    if (lastSyncedBaseKeyRef.current === baseQueryKey) return
    setPage(() => baseParams[pageParamKey])
    setNextPage(undefined)
    loadMoreBaseKeyRef.current = undefined
    lastSyncedBaseKeyRef.current = baseQueryKey
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [baseQueryKey])

  useEffect(() => {
    if (needLoad) {
      const onSuccessLoad = getOnSuccessRef.current
      const onFailedLoad = getOnErrorRef.current
      request.load().then(onSuccessLoad).catch(onFailedLoad)
    }
    optimisticIsLoadingRef.current = false
  }, [needLoad, request])

  useEffect(() => {
    getOnSuccessRef.current = async (...params) => onSuccess?.(...params)
  }, [onSuccess])

  useEffect(() => {
    getOnErrorRef.current = async err => onError?.(err) ?? onGlobalError?.(err)
  }, [onError, onGlobalError])

  const data = useMemo<UseInfiniteDataLoaderResult<ResultType, ErrorType>>(
    () => ({
      data: computedData,
      error: request.error,
      hasNextPage: nextPage !== undefined,
      isError,
      isFetching,
      isIdle,
      isLoading,
      isLoadingFirstPage,
      isSuccess,
      loadMore,
      reload,
    }),
    [
      computedData,
      isIdle,
      isLoading,
      isFetching,
      isSuccess,
      isError,
      request.error,
      isLoadingFirstPage,
      reload,
      nextPage,
      loadMore,
    ],
  )

  return data
}
