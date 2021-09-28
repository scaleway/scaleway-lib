import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useDataLoaderContext } from './DataLoaderProvider'
import { StatusEnum } from './constants'
import { PromiseType, UseDataLoaderConfig, UseDataLoaderResult } from './types'

/**
 * @param {string} key key to save the data fetched in a local cache
 * @param {() => PromiseType} method a method that return a promise
 * @param {useDataLoaderConfig} config hook configuration
 * @returns {useDataLoaderResult} hook result containing data, request state, and method to reload the data
 */
const useDataLoader = <T>(
  fetchKey: string,
  method: () => PromiseType<T>,
  {
    enabled = true,
    initialData,
    keepPreviousData = true,
    onError,
    onSuccess,
    pollingInterval,
    maxDataLifetime,
  }: UseDataLoaderConfig<T> = {},
): UseDataLoaderResult<T> => {
  const {
    addRequest,
    getCachedData,
    getRequest,
    onError: onErrorProvider,
  } = useDataLoaderContext()

  const data = useMemo(
    () => (getCachedData(fetchKey) || initialData) as T,
    [getCachedData, fetchKey, initialData],
  )

  const request = useMemo(
    () =>
      getRequest(fetchKey) ??
      addRequest(fetchKey, {
        key: fetchKey,
        maxDataLifetime,
        method,
        pollingInterval,
      }),
    [
      addRequest,
      fetchKey,
      getRequest,
      method,
      pollingInterval,
      maxDataLifetime,
    ],
  )

  useEffect(() => {
    if (enabled && request.status === StatusEnum.IDLE) {
      // eslint-disable-next-line no-void
      void request.load()
    }
  }, [request, enabled])

  useEffect(() => {
    if (request.method !== method) {
      request.method = method
    }
    request.addOnErrorListener(onError ?? onErrorProvider)
    request.addOnSuccessListener(onSuccess)

    return () => {
      request.removeOnErrorListener(onError ?? onErrorProvider)
      request.removeOnSuccessListener(onSuccess)
    }
  }, [onSuccess, onError, onErrorProvider, method, request])

  const cancelMethodRef = useRef<(() => void) | undefined>(request?.cancel)
  const isMountedRef = useRef(false)
  const isFetchingRef = useRef(false)

  const previousDataRef = useRef<T>()

  const isLoading = useMemo(
    () => request.status === StatusEnum.LOADING,
    [request.status],
  )
  const isIdle = useMemo(
    () => request.status === StatusEnum.IDLE,
    [request.status],
  )
  const isSuccess = useMemo(
    () => request.status === StatusEnum.SUCCESS,
    [request.status],
  )
  const isError = useMemo(
    () => request.status === StatusEnum.ERROR,
    [request.status],
  )
  const isPolling = useMemo(
    () => !!(enabled && pollingInterval && (isSuccess || isLoading)),
    [isSuccess, isLoading, enabled, pollingInterval],
  )

  useEffect(() => {
    isFetchingRef.current = isLoading || isPolling
  }, [isLoading, isPolling])

  useLayoutEffect(() => {
    cancelMethodRef.current = request?.cancel
  }, [request?.cancel])

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      if (isFetchingRef.current && cancelMethodRef.current) {
        cancelMethodRef.current()
      }
    }
  }, [])

  useEffect(
    () => () => {
      if (data !== previousDataRef.current) {
        previousDataRef.current = data
      }
    },
    [data, keepPreviousData],
  )

  return {
    data: (getCachedData(fetchKey) || initialData) as T,
    error: request?.error,
    isError,
    isIdle,
    isLoading,
    isPolling,
    isSuccess,
    previousData: previousDataRef.current,
    reload: () => request.load(true),
  }
}

export default useDataLoader
