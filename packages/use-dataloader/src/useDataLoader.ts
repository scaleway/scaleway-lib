import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDataLoaderContext } from './DataLoaderProvider'
import { StatusEnum } from './constants'
import { marshalQueryKey } from './helpers'
import type {
  KeyType,
  PromiseType,
  UseDataLoaderConfig,
  UseDataLoaderResult,
} from './types'

export const useDataLoader = <ResultType = unknown, ErrorType = Error>(
  key: KeyType,
  method: () => PromiseType<ResultType>,
  {
    enabled = true,
    onError,
    onSuccess,
    keepPreviousData = false,
    needPolling = true,
    pollingInterval,
    initialData,
    dataLifetime,
  }: UseDataLoaderConfig<ResultType, ErrorType> = {},
): UseDataLoaderResult<ResultType, ErrorType> => {
  const {
    getOrAddRequest,
    onError: onGlobalError,
    defaultDatalifetime,
  } = useDataLoaderContext()
  const computedDatalifetime = dataLifetime ?? defaultDatalifetime
  const methodRef = useRef(method)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError ?? onGlobalError)
  const needPollingRef = useRef(needPolling)
  const [, setCounter] = useState(0)

  const forceRerender = useCallback(() => {
    setCounter(current => current + 1)
  }, [])

  const queryKey = useMemo(() => marshalQueryKey(key), [key])

  const request = getOrAddRequest<ResultType, ErrorType>(queryKey, {
    enabled,
    method: methodRef.current,
  })

  useEffect(() => {
    request.addObserver(forceRerender)

    return () => {
      request.removeObserver(forceRerender)
    }
  }, [request, forceRerender])

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

  const isLoading =
    request.status === StatusEnum.LOADING || optimisticIsLoadingRef.current

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
      const defaultOnSuccessOrError = () => {}
      const onSuccessLoad = onSuccessRef.current ?? defaultOnSuccessOrError
      const onFailedLoad = onErrorRef.current ?? defaultOnSuccessOrError
      request.load().then(onSuccessLoad).catch(onFailedLoad)
    }
    optimisticIsLoadingRef.current = false
  }, [needLoad, request])

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (pollingInterval) {
      interval = setInterval(() => {
        if (
          (needPollingRef.current &&
            typeof needPollingRef.current === 'function' &&
            needPollingRef.current(request.data)) ||
          (typeof needPollingRef.current !== 'function' &&
            needPollingRef.current &&
            !request.isCalled)
        ) {
          const defaultOnSuccessOrError = () => {}
          const onSuccessLoad = onSuccessRef.current ?? defaultOnSuccessOrError
          const onFailedLoad = onErrorRef.current ?? defaultOnSuccessOrError

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
