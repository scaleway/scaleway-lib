import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useDataLoaderContext } from './DataLoaderProvider'
import { StatusEnum } from './constants'
import DataLoader from './dataloader'
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
    needPolling,
  }: UseDataLoaderConfig<T> = {},
): UseDataLoaderResult<T> => {
  const isMountedRef = useRef(false)
  const isFetchingRef = useRef(false)
  const unsubscribeRequestRef = useRef<() => void>()
  const previousDataRef = useRef<T>()
  const { getOrAddRequest, onError: onErrorProvider } = useDataLoaderContext()
  const [, forceReload] = useState(0)
  const subscribeFn = useCallback(() => {
    forceReload(x => x + 1)
  }, [])

  const request = useMemo(() => {
    if (unsubscribeRequestRef.current) {
      unsubscribeRequestRef.current()
    }

    const newRequest = getOrAddRequest(fetchKey, {
      keepPreviousData,
      maxDataLifetime,
      method,
      needPolling,
      pollingInterval,
    }) as DataLoader<T>

    unsubscribeRequestRef.current = () => newRequest.removeObserver(subscribeFn)
    newRequest.addObserver(subscribeFn)

    return newRequest
  }, [
    fetchKey,
    getOrAddRequest,
    maxDataLifetime,
    method,
    needPolling,
    pollingInterval,
    keepPreviousData,
    subscribeFn,
  ])

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

  const isLoading = useMemo(
    () =>
      (enabled && request.status === StatusEnum.IDLE) ||
      request.status === StatusEnum.LOADING,
    [request.status, enabled],
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
    if (enabled) {
      // launch should never throw
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      request.load()
    }
  }, [request, enabled, isIdle])

  useEffect(() => {
    if (pollingInterval !== request.pollingInterval) {
      request.setPollingInterval(pollingInterval)
    }
  }, [pollingInterval, request])

  useEffect(() => {
    if (needPolling !== request.needPolling) {
      request.setNeedPolling(needPolling ?? true)
    }
  }, [needPolling, request])

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
      unsubscribeRequestRef.current?.()
    }
  }, [])

  useEffect(() => () => {
    if (request.getData() !== previousDataRef.current && keepPreviousData) {
      previousDataRef.current = request.getData()
    }
  })

  return {
    data: request.getData() ?? (initialData as T),
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
