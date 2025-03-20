import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDataLoaderContext } from './DataLoaderProvider'
import { StatusEnum } from './constants'
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
  const requestRefs = useRef<DataLoader<ResultType, ErrorType>[]>([])
  const [page, setPage] = useState(baseParams[pageParamKey])
  const nextPageRef = useRef(page)
  const getNextPageRef = useRef(getNextPage)
  const methodRef = useRef(() =>
    method(
      pageParamKey && page
        ? ({ ...baseParams, [pageParamKey]: page } as ParamsType)
        : baseParams,
    ),
  )
  const paramsRef = useRef(
    pageParamKey && page
      ? ({ ...baseParams, [pageParamKey]: page } as ParamsType)
      : baseParams,
  )
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError ?? onGlobalError)
  const [, setCounter] = useState(0)

  const forceRerender = useCallback(() => {
    setCounter(current => current + 1)
  }, [])

  const baseQueryKey = useMemo(() => marshalQueryKey(baseKey), [baseKey])

  useEffect(
    () => () => {
      requestRefs.current.forEach(request =>
        request.removeObserver(forceRerender),
      )
    },
    [forceRerender],
  )

  const getCurrentRequest = () => {
    const currentQueryKey = marshalQueryKey([
      baseQueryKey,
      'infinite',
      page as string | number,
    ])
    requestRefs.current.forEach(request =>
      !request.key.startsWith(computeKey(baseQueryKey))
        ? request.removeObserver(forceRerender)
        : undefined,
    )
    requestRefs.current = requestRefs.current.filter(({ key }) =>
      key.startsWith(computeKey(baseQueryKey)),
    )
    const requestInRef = requestRefs.current.find(request =>
      request.key.endsWith(currentQueryKey),
    )
    if (!requestInRef) {
      const request = getOrAddRequest<ResultType, ErrorType>(currentQueryKey, {
        enabled,
        method: methodRef.current,
      })
      requestRefs.current.push(request)
      request.addObserver(forceRerender)

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
          !dataLifetime ||
          (request.dataUpdatedAt &&
            dataLifetime &&
            request.dataUpdatedAt + dataLifetime < Date.now()))
      ),
    [enabled, request.dataUpdatedAt, dataLifetime],
  )

  const optimisticIsLoadingRef = useRef(needLoad)

  const previousDataRef = useRef(request.data)

  const isLoading = requestRefs.current.some(
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
      requestRefs.current.map(req =>
        req.load(true).then(onSuccessRef.current).catch(onErrorRef.current),
      ),
    )
  }, [])

  useEffect(() => {
    request.method = () => method(paramsRef.current)
  }, [method, request])

  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])

  useEffect(() => {
    onErrorRef.current = onError ?? onGlobalError
  }, [onError, onGlobalError])

  useEffect(() => {
    if (keepPreviousData) {
      previousDataRef.current = request.data
    }
  }, [request.data, keepPreviousData])

  useEffect(() => {
    getNextPageRef.current = getNextPage
  }, [getNextPage])

  useEffect(() => {
    paramsRef.current =
      pageParamKey && page
        ? ({ ...baseParams, [pageParamKey]: page } as ParamsType)
        : baseParams
  }, [baseParams, pageParamKey, page])

  useEffect(() => {
    if (needLoad) {
      const defaultOnSuccessOrError = () => {}
      const onSuccessLoad = onSuccessRef.current ?? defaultOnSuccessOrError
      const onFailedLoad = onErrorRef.current ?? defaultOnSuccessOrError
      request
        .load()
        .then(async result => {
          if (getNextPageRef.current) {
            nextPageRef.current = getNextPageRef.current(
              result,
              paramsRef.current,
            ) as typeof nextPageRef.current
          }
          await onSuccessLoad(result)
        })
        .catch(onFailedLoad)
    }
    optimisticIsLoadingRef.current = false
  }, [needLoad, request])

  const loadMore = useCallback(() => {
    setPage(nextPageRef.current)
  }, [])

  const data = useMemo<UseInfiniteDataLoaderResult<ResultType, ErrorType>>(
    () => ({
      isIdle,
      isError,
      isLoading,
      isSuccess,
      hasNextPage: nextPageRef.current !== undefined,
      isLoadingFirstPage,
      data:
        isLoadingFirstPage ||
        [...requestRefs.current].filter(dataloader => !!dataloader.data)
          .length === 0
          ? initialData
          : ([...requestRefs.current]
              .filter(dataloader => !!dataloader.data)
              .map(dataloader => dataloader.data) as ResultType[]),
      error: request.error,
      reload,
      loadMore,
    }),
    [
      initialData,
      isIdle,
      isLoading,
      isSuccess,
      isError,
      request.error,
      isLoadingFirstPage,
      reload,
      loadMore,
    ],
  )

  return data
}
