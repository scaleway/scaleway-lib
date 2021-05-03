import { useEffect, useLayoutEffect, useMemo, useReducer, useRef } from 'react'
import { useDataLoaderContext } from './DataLoaderProvider'
import { ActionEnum, StatusEnum } from './constants'
import reducer from './reducer'

const Actions = {
  createReset: () => ({ type: ActionEnum.RESET }),
  createOnLoading: () => ({ type: ActionEnum.ON_LOADING }),
  createOnSuccess: () => ({ type: ActionEnum.ON_SUCCESS }),
  createOnError: error => ({ type: ActionEnum.ON_ERROR, error }),
}

/**
 * @typedef {Object} useDataLoaderConfig
 * @property {Function} [onSuccess] callback when a request success
 * @property {Function} [onError] callback when a error is occured
 * @property {*} [initialData] initial data if no one is present in the cache before the request
 * @property {number} [pollingInterval] relaunch the request after the last success
 * @property {boolean} [enabled=true] launch request automatically (default true)
 * @property {boolean} [keepPreviousData=true] do we need to keep the previous data after reload (default true)
 */

/**
 * @typedef {Object} useDataLoaderResult
 * @property {boolean} isIdle true if the hook in initial state
 * @property {boolean} isLoading true if the request is launched
 * @property {boolean} isSuccess true if the request success
 * @property {boolean} isError true if the request throw an error
 * @property {boolean} isPolling true if the request if enabled is true, pollingInterval is defined and the status is isLoading or isSuccess
 * @property {*} previousData if keepPreviousData is true it return the last data fetched
 * @property {*} data initialData if no data is fetched or not present in the cache otherwise return the data fetched
 * @property {string} error the error occured during the request
 * @property {Function} reload reload the data
 */

/**
 * @param {string} key key to save the data fetched in a local cache
 * @param {() => Promise} method a method that return a promise
 * @param {useDataLoaderConfig} config hook configuration
 * @returns {useDataLoaderResult} hook result containing data, request state, and method to reload the data
 */
const useDataLoader = (
  key,
  method,
  {
    onSuccess,
    onError,
    initialData,
    pollingInterval,
    enabled = true,
    keepPreviousData = true,
  } = {},
) => {
  const {
    addCachedData,
    addReload,
    clearReload,
    getCachedData,
  } = useDataLoaderContext()
  const [{ status, error }, dispatch] = useReducer(reducer, {
    status: StatusEnum.IDLE,
    error: undefined,
  })

  const previousDataRef = useRef()
  const keyRef = useRef(key)
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

  const handleRequest = useRef(async cacheKey => {
    try {
      dispatch(Actions.createOnLoading())
      const result = await methodRef.current?.()

      if (keyRef.current && cacheKey && cacheKey !== keyRef.current) {
        return
      }

      if (keepPreviousData) {
        previousDataRef.current = getCachedData(cacheKey)
      }
      if (result !== undefined && result !== null && cacheKey)
        addCachedData(cacheKey, result)

      dispatch(Actions.createOnSuccess())

      await onSuccessRef.current?.(result)
    } catch (err) {
      dispatch(Actions.createOnError(err))
      await onErrorRef.current?.(err)
    }
  })

  useEffect(() => {
    let handler
    if (enabled) {
      if (!isIdle && keyRef.current !== key) {
        keyRef.current = key
        dispatch(Actions.createReset())
      } else {
        if (isIdle) {
          keyRef.current = key
          handleRequest.current(key)
        }
        if (pollingInterval && isSuccess && !handler) {
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
        handler = undefined
      }
    }
    // Why can't put empty array for componentDidMount, componentWillUnmount ??? No array act like componentDidMount and componentDidUpdate
  }, [
    enabled,
    key,
    clearReload,
    addReload,
    addCachedData,
    getCachedData,
    pollingInterval,
    isIdle,
    isSuccess,
  ])

  useLayoutEffect(() => {
    methodRef.current = method
  }, [method])

  return {
    isLoading,
    isIdle,
    isSuccess,
    isError,
    isPolling,
    previousData: previousDataRef.current,
    data: getCachedData(key) || initialData,
    error,
    reload: args => handleRequest.current(key, args),
  }
}

export default useDataLoader
