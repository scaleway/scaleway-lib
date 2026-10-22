import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StatusEnum } from './constants'
import type DataLoader from './dataloader'
import { useDataLoaderContext } from './DataLoaderProvider'
import { createTokenGuardedHandlers, marshalQueryKey } from './helpers'
import type {
  DataLoaderMethodOptions,
  DataLoaderMethodWithParamsFn,
  KeyType,
  UseInfiniteDataLoaderConfig,
  UseInfiniteDataLoaderResult,
} from './types'

/**
 * This hook can be used for promises that have a "Load More" so page change but we want to keep the previous data and append the next one
 * With `getPreviousPage` it can also "Load Previous", previous pages are prepended before the current ones in `data`
 */
export const useInfiniteDataLoader = <
  ResultType = unknown,
  ErrorType extends Error = Error,
  ParamsType extends Record<string, unknown> = Record<string, unknown>,
  ParamsPageKey extends keyof ParamsType = keyof ParamsType,
  // oxlint-disable-next-line max-params
>(
  baseKey: KeyType,
  method: DataLoaderMethodWithParamsFn<ResultType, ParamsType>,
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
    getPreviousPage,
    previousPageParamKey,
    maxPages,
  } = config ?? {}

  const computedDatalifetime = dataLifetime ?? defaultDatalifetime
  const requestRefs = useRef<DataLoader<ResultType, ErrorType>[]>([])
  // Params aligned with requestRefs, used to compute the tokens of the first and last loaded pages
  const pageParamsRef = useRef<ParamsType[]>([])
  const [page, setPage] = useState(baseParams[pageParamKey])
  const [nextPage, setNextPage] = useState<typeof page | undefined>(page)
  // Token of the current page when it was fetched with loadPrevious, the current page is a forward page when undefined
  const [previousPageTarget, setPreviousPageTarget] = useState<typeof page | undefined>(undefined)
  // Direction of the last navigation, used to expose which direction is currently fetching
  const [fetchDirection, setFetchDirection] = useState<'backward' | 'forward' | undefined>(undefined)
  const navigationBaseKeyRef = useRef<string | undefined>(undefined)
  const baseQueryKey = useMemo(() => marshalQueryKey(baseKey), [baseKey])
  const lastSyncedBaseKeyRef = useRef<string>(baseQueryKey)
  const isPageStale = lastSyncedBaseKeyRef.current !== baseQueryKey

  const buildPreviousParams = (token: typeof page): ParamsType => {
    // A previous page token can go under another param key, and two-token APIs (eg `before` vs `after`) reject the forward cursor when the previous one is sent
    const { [pageParamKey]: _forwardToken, ...params } = baseParams

    return { ...params, [previousPageParamKey ?? pageParamKey]: token } as ParamsType
  }

  const forwardPageToken = isPageStale ? baseParams[pageParamKey] : page
  const paramsArgs =
    !isPageStale && previousPageTarget !== undefined
      ? buildPreviousParams(previousPageTarget)
      : { ...baseParams, [pageParamKey]: forwardPageToken }

  const getMethodRef = useRef(async (options: DataLoaderMethodOptions) => method(paramsArgs, options))
  const getOnSuccessRef = useRef(async (...params: Parameters<NonNullable<typeof onSuccess>>) => onSuccess?.(...params))
  const getOnErrorRef = useRef(async (err: ErrorType) => onError?.(err) ?? onGlobalError?.(err))

  const [, setCounter] = useState(0)
  // Monotonic token bumped on every auto-load or reload initiation: a settled
  // load (e.g. a launch cancelled by a React StrictMode remount) whose token
  // is no longer current must not fire user handlers nor reset optimistic state.
  const loadTokenRef = useRef(0)

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

        if (request.observers.length === 0) {
          request.cancel()
        }
      }
    }
  }, [])

  const getCurrentRequest = () => {
    const isCurrentPrevious = !isPageStale && previousPageTarget !== undefined
    const isPreviousDualKey = previousPageParamKey !== undefined && previousPageParamKey !== pageParamKey
    const effectivePage = isPageStale ? baseParams[pageParamKey] : page
    const currentPageKey = isCurrentPrevious
      ? marshalQueryKey([baseQueryKey, 'infinite', previousPageTarget as string | number])
      : marshalQueryKey([baseQueryKey, 'infinite', effectivePage as string | number])
    // shortcut: dual-key previous requests need a distinct cache key, a forward token containing dots could collide with it
    const currentQueryKey =
      isCurrentPrevious && isPreviousDualKey
        ? marshalQueryKey([baseQueryKey, 'infinite', 'previous', previousPageTarget as string | number])
        : currentPageKey
    const initialPageKey = marshalQueryKey([baseQueryKey, 'infinite', baseParams[pageParamKey] as string | number])

    // Clean bad requests in the array
    const keptRequests: DataLoader<ResultType, ErrorType>[] = []
    const keptParams: ParamsType[] = []
    requestRefs.current.forEach((request, index) => {
      const isKept = isPageStale
        ? request.key.endsWith(initialPageKey)
        : request.key.startsWith(computeKey(baseQueryKey))

      if (isKept) {
        const params = pageParamsRef.current[index]

        if (params) {
          keptRequests.push(request)
          keptParams.push(params)
        }
      } else {
        request.removeObserver(forceRerender.current)
        request.cancel()
      }
    })
    requestRefs.current = keptRequests
    pageParamsRef.current = keptParams

    const currentRequestIndex = requestRefs.current.findIndex(request => request.key.endsWith(currentQueryKey))

    // Sliding window, trimmed from the opposite end of the fetch once the fetched page has data, like React Query's maxPages
    const trimWindowPages = (currentRequest: DataLoader<ResultType, ErrorType>, position: number) => {
      if (maxPages !== undefined && requestRefs.current.length > maxPages && currentRequest.data) {
        const overflow = requestRefs.current.length - maxPages
        const start = position === requestRefs.current.length - 1 ? 0 : maxPages
        const droppedRequests = requestRefs.current.splice(start, overflow)

        pageParamsRef.current.splice(start, overflow)
        for (const droppedRequest of droppedRequests) {
          droppedRequest.removeObserver(forceRerender.current)
          droppedRequest.cancel()
        }
      }
    }

    if (currentRequestIndex !== -1) {
      const currentRequest = requestRefs.current[currentRequestIndex] as DataLoader<ResultType, ErrorType>

      // Keep the current page params fresh, method or baseParams can change between renders
      pageParamsRef.current[currentRequestIndex] = paramsArgs
      trimWindowPages(currentRequest, currentRequestIndex)

      return currentRequest
    }

    const request = getOrAddRequest<ResultType, ErrorType>(currentQueryKey, {
      enabled,
      method: getMethodRef.current,
    })

    if (!request.observers.includes(forceRerender.current)) {
      request.addObserver(forceRerender.current)
    }

    if (isCurrentPrevious) {
      // Previous pages are prepended so data stays ordered from oldest to newest
      requestRefs.current.unshift(request)
      pageParamsRef.current.unshift(paramsArgs)
    } else {
      requestRefs.current.push(request)
      pageParamsRef.current.push(paramsArgs)
    }

    trimWindowPages(request, isCurrentPrevious ? 0 : requestRefs.current.length - 1)

    return request
  }

  const request = getCurrentRequest()

  // Compute nextPage from the last loaded page during render to avoid stale closures, and return the token of the previous one
  const syncWindowTokens = (): typeof page | undefined => {
    const edges: {
      first?: { params: ParamsType; request: DataLoader<ResultType, ErrorType> }
      last?: { params: ParamsType; request: DataLoader<ResultType, ErrorType> }
    } = {}

    requestRefs.current.forEach((req, index) => {
      if (req.data) {
        const params = pageParamsRef.current[index]

        if (params) {
          const edge = { params, request: req }

          edges.first ??= edge
          edges.last = edge
        }
      }
    })

    const firstEdge = edges.first
    const lastEdge = edges.last

    if (lastEdge?.request.data) {
      const computedNextPage = getNextPage ? getNextPage(lastEdge.request.data, lastEdge.params) : undefined
      if (computedNextPage !== nextPage) {
        setNextPage(computedNextPage)
      }
    }

    return getPreviousPage && firstEdge?.request.data
      ? getPreviousPage(firstEdge.request.data, firstEdge.params)
      : undefined
  }

  const previousPage = syncWindowTokens()

  const needLoad = useMemo(
    () =>
      Boolean(
        enabled &&
        (!(request.dataUpdatedAt && computedDatalifetime) ||
          (request.dataUpdatedAt && computedDatalifetime && request.dataUpdatedAt + computedDatalifetime < Date.now())),
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
    isLoadingFirstPage || [...requestRefs.current].filter(dataloader => Boolean(dataloader.data)).length === 0
      ? initialData
      : [...requestRefs.current]
          .map(dataloader => dataloader.data)
          .filter((data): data is NonNullable<typeof data> => Boolean(data))
  // isLoading is true only when there is no cache data and we're fetching data for the first time
  const isLoading = !computedData && request.isFirstLoading && request.status === StatusEnum.LOADING

  const reload = useCallback(async () => {
    // A refetch has no direction, like React Query neither isFetchingNextPage nor isFetchingPreviousPage is true during reload
    setFetchDirection(undefined)
    const { onSuccessCallback, onErrorCallback } = createTokenGuardedHandlers(
      loadTokenRef,
      async (result: ResultType) => getOnSuccessRef.current(result),
      async (error: ErrorType) => getOnErrorRef.current(error),
    )

    await Promise.all(
      requestRefs.current.map(async req => req.load(true).then(onSuccessCallback).catch(onErrorCallback)),
    )
  }, [])

  const loadMore = useCallback(() => {
    if (nextPage) {
      navigationBaseKeyRef.current = baseQueryKey
      setPreviousPageTarget(undefined)
      setFetchDirection('forward')
      setPage(() => {
        if (navigationBaseKeyRef.current !== baseQueryKey) {
          return baseParams[pageParamKey]
        }
        return nextPage
      })
    }
  }, [nextPage, baseQueryKey, baseParams, pageParamKey])

  const loadPrevious = useCallback(() => {
    if (previousPage) {
      navigationBaseKeyRef.current = baseQueryKey
      setFetchDirection('backward')
      setPreviousPageTarget(() => {
        if (navigationBaseKeyRef.current !== baseQueryKey) {
          return undefined
        }
        return previousPage
      })
    }
  }, [previousPage, baseQueryKey])

  useEffect(() => {
    request.method = async (options: DataLoaderMethodOptions) => method(paramsArgs, options)
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [method, request])

  useEffect(() => {
    if (keepPreviousData) {
      previousDataRef.current = request.data
    }
  }, [request.data, keepPreviousData])

  // Reset page when baseParams or pageParamKey change
  useEffect(() => {
    if (lastSyncedBaseKeyRef.current === baseQueryKey) {
      return
    }
    setPage(() => baseParams[pageParamKey])
    setNextPage(undefined)
    setPreviousPageTarget(undefined)
    setFetchDirection(undefined)
    navigationBaseKeyRef.current = undefined
    lastSyncedBaseKeyRef.current = baseQueryKey
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [baseQueryKey])

  useEffect(() => {
    if (needLoad) {
      const { onSuccessCallback, onErrorCallback } = createTokenGuardedHandlers(
        loadTokenRef,
        async (result: ResultType) => getOnSuccessRef.current(result),
        async (error: ErrorType) => getOnErrorRef.current(error),
      )

      request.load().then(onSuccessCallback).catch(onErrorCallback)
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
      hasPreviousPage: previousPage !== undefined,
      isError,
      isFetching,
      isFetchingNextPage: fetchDirection === 'forward' && isFetching,
      isFetchingPreviousPage: fetchDirection === 'backward' && isFetching,
      isIdle,
      isLoading,
      isLoadingFirstPage,
      isSuccess,
      loadMore,
      loadPrevious,
      reload,
    }),
    [
      computedData,
      fetchDirection,
      isIdle,
      isLoading,
      isFetching,
      isSuccess,
      isError,
      request.error,
      isLoadingFirstPage,
      reload,
      nextPage,
      previousPage,
      loadMore,
      loadPrevious,
    ],
  )

  return data
}
