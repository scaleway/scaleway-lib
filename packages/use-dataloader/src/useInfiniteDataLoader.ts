// oxlint-disable eslint/max-statements

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StatusEnum } from './constants'
import { useDataLoaderContext } from './DataLoaderProvider'
import type DataLoader from './dataloader'
import { marshalQueryKey } from './helpers'
import type {
  KeyType,
  PromiseType,
  UseInfiniteDataLoaderConfig,
  UseInfiniteDataLoaderResult,
} from './types'

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
  config?: UseInfiniteDataLoaderConfig<
    ResultType,
    ErrorType,
    ParamsType,
    ParamsPageKey
  >,
): UseInfiniteDataLoaderResult<ResultType, ErrorType> => {
  const {
    getOrAddRequest,
    computeKey,
    onError: onGlobalError,
    defaultDatalifetime,
  } = useDataLoaderContext()
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
  const nextPageRef = useRef<typeof page | undefined>(page)

  const getNextPageFnRef = useRef(
    (...params: Parameters<NonNullable<typeof getNextPage>>) =>
      getNextPage ? getNextPage(...params) : undefined,
  )

  const paramsArgs = {
    ...baseParams,
    [pageParamKey]: page,
  }

  const getMethodRef = useRef(async () => method(paramsArgs))
  const getOnSuccessRef = useRef(
    async (...params: Parameters<NonNullable<typeof onSuccess>>) =>
      onSuccess?.(...params),
  )

  const getOnErrorRef = useRef(
    async (err: ErrorType) => onError?.(err) ?? onGlobalError?.(err),
  )

  const [, setCounter] = useState(0)

  const forceRerender = useRef(() => {
    setCounter(current => current + 1)
  })

  const baseQueryKey = useMemo(() => marshalQueryKey(baseKey), [baseKey])

  useEffect(() => {
    const notifyFn = forceRerender.current
    // Ensure observers are added after first mount
    requestRefs.current.forEach(request => {
      if (!request.observers.includes(notifyFn)) {
        request.addObserver(notifyFn)
      }
    })

    return () => {
      requestRefs.current.forEach(request => {
        request.removeObserver(notifyFn)
      })
    }
  }, [])

  const getCurrentRequest = () => {
    const currentQueryKey = marshalQueryKey([
      baseQueryKey,
      'infinite',
      page as string | number,
    ])

    // Clean bad requests in the array
    requestRefs.current = requestRefs.current.filter(request => {
      if (request.key.startsWith(computeKey(baseQueryKey))) {
        return true
      }

      request.removeObserver(forceRerender.current)

      return false
    })

    const requestInRef = requestRefs.current.find(request =>
      request.key.endsWith(currentQueryKey),
    )

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

  const needLoad = useMemo(
    () =>
      !!(
        enabled &&
        (!request.dataUpdatedAt ||
          !computedDatalifetime ||
          (request.dataUpdatedAt &&
            computedDatalifetime &&
            request.dataUpdatedAt + computedDatalifetime < Date.now()))
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
    (request.status === StatusEnum.LOADING || optimisticIsLoadingRef.current) &&
    requestRefs.current.length <= 1

  const isSuccess = request.status === StatusEnum.SUCCESS

  const isError = request.status === StatusEnum.ERROR

  const isIdle = requestRefs.current.every(
    req => req.status === StatusEnum.IDLE && !enabled,
  )

  const reload = useCallback(async () => {
    await Promise.all(
      requestRefs.current.map(async req =>
        req
          .load(true)
          .then(getOnSuccessRef.current)
          .catch(getOnErrorRef.current),
      ),
    )
  }, [])

  const loadMoreRef = useRef(() => {
    if (nextPageRef.current) {
      setPage(curr => nextPageRef.current ?? curr)
    }
  })

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
    setPage(() => baseParams[pageParamKey])
    nextPageRef.current = baseParams[pageParamKey]
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [baseQueryKey])

  useEffect(() => {
    if (needLoad) {
      const onSuccessLoad = getOnSuccessRef.current
      const onFailedLoad = getOnErrorRef.current
      request
        .load()
        .then(async result => {
          nextPageRef.current = getNextPageFnRef.current(
            result,
            paramsArgs,
          ) as typeof page
          await onSuccessLoad(result)
        })
        .catch(onFailedLoad)
    }
    optimisticIsLoadingRef.current = false
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [needLoad, request])

  useEffect(() => {
    getOnSuccessRef.current = async (...params) => onSuccess?.(...params)
  }, [onSuccess])

  useEffect(() => {
    getOnErrorRef.current = async err => onError?.(err) ?? onGlobalError?.(err)
  }, [onError, onGlobalError])

  useEffect(() => {
    getNextPageFnRef.current = (...params) =>
      getNextPage ? getNextPage(...params) : undefined
  }, [getNextPage])

  const computedData =
    isLoadingFirstPage ||
    [...requestRefs.current].filter(dataloader => !!dataloader.data).length ===
      0
      ? initialData
      : ([...requestRefs.current]
          .filter(dataloader => !!dataloader.data)
          .map(dataloader => dataloader.data) as ResultType[])

  // isLoading is true only when there is no cache data and we're fetching data for the first time
  const isLoading =
    !computedData &&
    request.isFirstLoading &&
    request.status === StatusEnum.LOADING

  const data = useMemo<UseInfiniteDataLoaderResult<ResultType, ErrorType>>(
    () => ({
      data: computedData,
      error: request.error,
      hasNextPage: nextPageRef.current !== undefined,
      isError,
      isFetching,
      isIdle,
      isLoading,
      isLoadingFirstPage,
      isSuccess,
      loadMore: loadMoreRef.current,
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
    ],
  )

  return data
}
