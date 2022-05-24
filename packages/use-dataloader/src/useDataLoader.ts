import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useDataLoaderContext } from './DataLoaderProvider'
import { StatusEnum } from './constants'
import DataLoader from './dataloader'
import { PromiseType, UseDataLoaderConfig, UseDataLoaderResult } from './types'

function useDataLoader<ResultType, ErrorType = Error>(
  fetchKey: string,
  method: () => PromiseType<ResultType>,
  {
    enabled = true,
    onError,
    onSuccess,
    keepPreviousData = false,
    needPolling = true,
    pollingInterval,
    initialData,
  }: UseDataLoaderConfig<ResultType> = {},
): UseDataLoaderResult<ResultType, ErrorType> {
  const { getOrAddRequest, onError: onGlobalError } = useDataLoaderContext()
  const methodRef = useRef(method)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError ?? onGlobalError)
  const isMountedRef = useRef(false)
  const [, setCounter] = useState(0)
  const forceRerender = useCallback(() => {
    setCounter(current => current + 1)
  }, [])

  useLayoutEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  })

  const request = getOrAddRequest(fetchKey, {
    enabled,
    method: methodRef.current,
  }) as DataLoader<ResultType, ErrorType>

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
    ((typeof needPolling === 'function' &&
      (request.isFirstLoading || needPolling(request.data))) ||
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
    if (keepPreviousData) {
      previousDataRef.current = request.data
    }
  }, [request.data, keepPreviousData])

  useEffect(() => {
    if (enabled && !request.isCalled) {
      request.load().then(onSuccessRef.current).catch(onErrorRef.current)
    }
  }, [enabled, request, keepPreviousData])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (
      isMountedRef.current &&
      request &&
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
      if (timeout && !isMountedRef.current) clearTimeout(timeout)
    }
  }, [pollingInterval, needPolling, request, request.status, request.data])

  return {
    data: !request.isFirstLoading ? request.data : initialData,
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

export default useDataLoader
