import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_REFETCH_ON_FOCUS, DEFAULT_REFETCH_ON_RECONNECT, StatusEnum } from './constants'
import { useDataLoaderContext } from './DataLoaderProvider'
import { createTokenGuardedHandlers } from './helpers'
import type { DataLoaderMethodFn, KeyType, RefetchPolicy, UseDataLoaderConfig, UseDataLoaderResult } from './types'

const noop = () => undefined

export const useDataLoader = <ResultType = unknown, ErrorType = Error>(
  key: KeyType,
  method: DataLoaderMethodFn<ResultType>,
  config?: UseDataLoaderConfig<ResultType, ErrorType>,
): UseDataLoaderResult<ResultType, ErrorType> => {
  const {
    enabled = true,
    onError,
    onSuccess,
    keepPreviousData = false,
    needPolling = true,
    pollingInterval,
    initialData,
    dataLifetime,
    refetchOnFocus,
    refetchOnReconnect,
  } = config ?? {}

  const {
    getOrAddRequest,
    onError: onGlobalError,
    defaultDatalifetime,
    defaultRefetchOnFocus,
    defaultRefetchOnReconnect,
  } = useDataLoaderContext()
  const computedDatalifetime = dataLifetime ?? defaultDatalifetime
  const computedRefetchOnFocus = refetchOnFocus ?? defaultRefetchOnFocus ?? DEFAULT_REFETCH_ON_FOCUS
  const computedRefetchOnReconnect = refetchOnReconnect ?? defaultRefetchOnReconnect ?? DEFAULT_REFETCH_ON_RECONNECT
  const refetchPolicy = useMemo<RefetchPolicy>(
    () => ({
      dataLifetime: computedDatalifetime,
      enabled,
      onFocus: computedRefetchOnFocus,
      onReconnect: computedRefetchOnReconnect,
    }),
    [computedDatalifetime, computedRefetchOnFocus, computedRefetchOnReconnect, enabled],
  )
  const methodRef = useRef(method)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError ?? onGlobalError)
  const needPollingRef = useRef(needPolling)
  const [, setCounter] = useState(0)
  // Monotonic token bumped on every auto-load or reload initiation: a settled
  // load (e.g. a launch cancelled by a React StrictMode remount) whose token
  // is no longer current must not fire user handlers nor reset optimistic state.
  const loadTokenRef = useRef(0)

  const forceRerender = useCallback(() => {
    setCounter(current => current + 1)
  }, [])

  const request = getOrAddRequest<ResultType, ErrorType>(key, {
    enabled,
    method: methodRef.current,
  })

  useEffect(() => {
    request.addObserver(forceRerender)

    return () => {
      request.removeObserver(forceRerender)

      if (request.observers.length === 0) {
        request.cancel()
      }
    }
  }, [request, forceRerender])

  // Registered on its own effect: a policy change must not remove the
  // observer, which would cancel an in-flight request
  useEffect(() => {
    request.refetchPolicies.add(refetchPolicy)

    return () => {
      request.refetchPolicies.delete(refetchPolicy)
    }
  }, [request, refetchPolicy])

  const needLoad = useMemo(
    () =>
      Boolean(
        enabled &&
        (!(request.dataUpdatedAt && computedDatalifetime) ||
          // oxlint-disable-next-line react/purity
          (request.dataUpdatedAt && computedDatalifetime && request.dataUpdatedAt + computedDatalifetime < Date.now())),
      ),
    [enabled, request.dataUpdatedAt, computedDatalifetime],
  )

  const optimisticIsLoadingRef = useRef(needLoad)

  const previousDataRef = useRef(request.data)

  // Compute the data that will be returned to the user
  const computedData = request.isFirstLoading ? initialData : request.data

  // isLoading is true only when there is no cache data and we're fetching data for the first time
  const isLoading =
    !computedData && request.isFirstLoading && (request.status === StatusEnum.LOADING || optimisticIsLoadingRef.current)

  // isFetching is true when there is an active request in progress
  const isFetching = request.status === StatusEnum.LOADING || optimisticIsLoadingRef.current

  const isSuccess = request.status === StatusEnum.SUCCESS

  const isError = request.status === StatusEnum.ERROR

  const isIdle = request.status === StatusEnum.IDLE && !enabled

  const isPolling = Boolean(
    pollingInterval &&
    ((typeof needPolling === 'function' && (request.isFirstLoading || needPolling(request.data))) ||
      (typeof needPolling !== 'function' && needPolling)),
  )

  const reload: () => Promise<void> = useCallback(async () => {
    // Set optimistic loading state to true when reload is called
    optimisticIsLoadingRef.current = true

    const clearOptimisticLoading = () => {
      optimisticIsLoadingRef.current = false
    }

    const { onSuccessCallback, onErrorCallback } = createTokenGuardedHandlers(
      loadTokenRef,
      async (result: ResultType) => {
        clearOptimisticLoading()
        return onSuccessRef.current?.(result)
      },
      async (error: ErrorType & Error) => {
        clearOptimisticLoading()
        return onErrorRef.current?.(error)
      },
    )

    return request.load(true).then(onSuccessCallback).catch(onErrorCallback)
  }, [request])

  useEffect(() => {
    needPollingRef.current = needPolling
  }, [needPolling])

  useEffect(() => {
    request.method = method
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
    if (needLoad) {
      // Set optimistic loading state to true when auto-loading is triggered
      optimisticIsLoadingRef.current = true

      const clearOptimisticLoading = () => {
        optimisticIsLoadingRef.current = false
      }

      const { onSuccessCallback, onErrorCallback } = createTokenGuardedHandlers(
        loadTokenRef,
        async (result: ResultType) => (onSuccessRef.current ?? clearOptimisticLoading)(result),
        async (error: ErrorType & Error) => (onErrorRef.current ?? clearOptimisticLoading)(error),
      )

      request.load().then(onSuccessCallback).catch(onErrorCallback)
    }
  }, [needLoad, request])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined = undefined

    if (pollingInterval) {
      interval = setInterval(() => {
        if (
          (needPollingRef.current &&
            typeof needPollingRef.current === 'function' &&
            needPollingRef.current(request.data)) ||
          (typeof needPollingRef.current !== 'function' && needPollingRef.current && !request.isCalled)
        ) {
          const onSuccessLoad = onSuccessRef.current ?? noop
          const onFailedLoad = onErrorRef.current ?? noop

          request.load(true).then(onSuccessLoad).catch(onFailedLoad)
        }
      }, pollingInterval)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [pollingInterval, request])

  return {
    data: computedData,
    dataUpdatedAt: request.dataUpdatedAt,
    error: request.error,
    isError,
    isFetching,
    isIdle,
    isLoading,
    isPolling,
    isSuccess,
    previousData: previousDataRef.current,
    reload,
  }
}
