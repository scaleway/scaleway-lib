import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDataLoaderContext } from './DataLoaderProvider'
import { StatusEnum } from './constants'
import { PromiseType, UseDataLoaderConfig, UseDataLoaderResult } from './types'

function useDataLoaderV2<T, ErrorType = Error>(
  fetchKey: string,
  method: () => PromiseType<T>,
  {
    enabled = true,
    onError,
    onSuccess,
    keepPreviousData = false,
    needPolling = true,
    pollingInterval,
    initialData,
  }: UseDataLoaderConfig<T> = {},
): UseDataLoaderResult<T, ErrorType> {
  const { getOrAddRequest, onError: onGlobalError } = useDataLoaderContext()
  const methodRef = useRef(method)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError ?? onGlobalError)
  const [, setCounter] = useState(0)
  const forceRerender = useCallback(() => {
    setCounter(current => current + 1)
  }, [])

  const request = useMemo(
    () =>
      getOrAddRequest(fetchKey, {
        enabled,
        method: methodRef.current,
      }) as DataLoader<T, ErrorType>,
    [getOrAddRequest, fetchKey, enabled],
  )

  useEffect(() => {
    request.addObserver(forceRerender)

    return () => {
      request.removeObserver(forceRerender)
    }
  }, [request, forceRerender])

  const previousDataRef = useRef(request.data)

  const isLoading = request.status === StatusEnum.LOADING

  const isSuccess = request.status === StatusEnum.SUCCESS

  const isError = request.status === StatusEnum.ERROR

  const isIdle = request.status === StatusEnum.IDLE && !enabled

  const isPolling = !!(
    pollingInterval &&
    ((typeof needPolling === 'function' && needPolling(request.data)) ||
      (typeof needPolling !== 'function' && needPolling))
  )

  const reload = useCallback(
    () =>
      request.load(true).then(onSuccessRef.current).catch(onErrorRef.current),
    [request],
  )

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
    if (enabled && request.loadCount === 0) {
      if (keepPreviousData) {
        previousDataRef.current = request.data
      }
      request.load().then(onSuccessRef.current).catch(onErrorRef.current)
    }
  }, [enabled, request, keepPreviousData])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (
      pollingInterval &&
      needPolling &&
      (request.status === StatusEnum.SUCCESS ||
        request.status === StatusEnum.ERROR)
    ) {
      if (
        (typeof needPolling === 'function' && needPolling(request.data)) ||
        (typeof needPolling !== 'function' && needPolling)
      ) {
        timeout = setTimeout(() => {
          request
            .load(true)
            .then(onSuccessRef.current)
            .catch(onErrorRef.current)
        }, pollingInterval)
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [pollingInterval, needPolling, request, request.status, request.data])

  return {
    data: request.loadCount > 0 ? request.data : initialData,
    error: request.error,
    isError,
    isIdle,
    isLoading,
    isPolling,
    isSuccess,
    previousData: previousDataRef.current,
    reload,
  }
}

export default useDataLoaderV2
