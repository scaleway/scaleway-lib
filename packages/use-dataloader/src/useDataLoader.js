import { useEffect, useLayoutEffect, useMemo, useReducer, useRef } from 'react'
import { useDataLoaderContext } from './DataLoaderProvider'
import { ActionEnum, StatusEnum } from './constants'
import reducer from './reducer'

const Actions = {
  createReset: ({ data }) => ({ type: ActionEnum.RESET, data }),
  createOnLoading: () => ({ type: ActionEnum.ON_LOADING }),
  createOnSuccess: data => ({ type: ActionEnum.ON_SUCCESS, data }),
  createOnUpdateData: data => ({ type: ActionEnum.ON_UPDATE_DATA, data }),
  createOnError: error => ({ type: ActionEnum.ON_ERROR, error }),
}

const useDataLoader = (
  key,
  method,
  {
    onSuccess,
    onError,
    initialData,
    pollingInterval,
    enabled = true,
    reloadOnKeyChange = true,
    keepPreviousData = true,
  } = {},
) => {
  const {
    addCachedData,
    addReload,
    clearReload,
    getCachedData,
  } = useDataLoaderContext()
  const [{ status, data, error }, dispatch] = useReducer(reducer, {
    status: StatusEnum.IDLE,
    data: initialData,
    error: undefined,
  })

  const previousDataRef = useRef()
  const keyRef = useRef()
  const methodRef = useRef(method)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)

  const isLoading = useMemo(() => status === StatusEnum.LOADING, [status])
  const isIdle = useMemo(() => status === StatusEnum.IDLE, [status])
  const isSuccess = useMemo(() => status === StatusEnum.SUCCESS, [status])
  const isError = useMemo(() => status === StatusEnum.ERROR, [status])
  const isPolling = useMemo(
    () => enabled && pollingInterval && (isSuccess || isLoading),
    [isSuccess, isLoading, enabled, pollingInterval],
  )

  const handleRequest = useRef(async (cacheKey, args) => {
    const cachedData = getCachedData(cacheKey)
    if (cacheKey && !data && cachedData) {
      dispatch(Actions.createOnUpdateData(cachedData))
    }
    try {
      dispatch(Actions.createOnLoading())
      const result = await methodRef.current?.(args)

      if (result && cacheKey) addCachedData(cacheKey, result)
      if (keyRef.current && cacheKey && cacheKey !== keyRef.current) {
        return
      }

      dispatch(Actions.createOnSuccess(result))

      await onSuccessRef.current?.(result)
    } catch (err) {
      dispatch(Actions.createOnError(err))
      await onErrorRef.current?.(err)
    }
  })

  useEffect(() => {
    let handler
    if (enabled) {
      if (
        reloadOnKeyChange &&
        key !== keyRef.current &&
        status !== StatusEnum.IDLE
      ) {
        keyRef.current = key
        dispatch(Actions.createReset({ data: initialData }))
      } else {
        if (status === StatusEnum.IDLE) {
          keyRef.current = key
          handleRequest.current(key)
        }
        if (pollingInterval && status === StatusEnum.SUCCESS) {
          handler = setTimeout(
            () => handleRequest.current(key),
            pollingInterval,
          )
        }
        if (key && typeof key === 'string') {
          addReload(key, reloadArgs => handleRequest.current(key, reloadArgs))
        }
      }
    }

    return () => {
      if (key && typeof key === 'string') {
        clearReload(key)
      }
      if (handler) {
        clearTimeout(handler)
      }
    }
    // Why can't put empty array for componentDidMount, componentWillUnmount ??? No array act like componentDidMount and componentDidUpdate
  }, [
    enabled,
    pollingInterval,
    key,
    clearReload,
    addReload,
    status,
    reloadOnKeyChange,
    initialData,
  ])

  useLayoutEffect(() => {
    methodRef.current = method
  }, [method])

  useLayoutEffect(() => {
    if (keepPreviousData && data && previousDataRef.current !== data) {
      previousDataRef.current = data
    }
  }, [keepPreviousData, data])

  return {
    isLoading,
    isIdle,
    isSuccess,
    isError,
    isPolling,
    previousData: previousDataRef.current,
    data,
    error,
    reload: args => handleRequest.current(key, args),
  }
}

export default useDataLoader
