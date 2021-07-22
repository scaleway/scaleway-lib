import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { useDataLoaderContext } from './DataLoaderProvider'
import { ActionEnum, StatusEnum } from './constants'
import reducer from './reducer'

const Actions = {
  createOnError: (error: Error) => ({ error, type: ActionEnum.ON_ERROR }),
  createOnLoading: () => ({ type: ActionEnum.ON_LOADING }),
  createOnSuccess: () => ({ type: ActionEnum.ON_SUCCESS }),
  createReset: () => ({ type: ActionEnum.RESET }),
}

/**
 * @typedef {Object} UseDataLoaderConfig
 * @property {Function} [onSuccess] callback when a request success
 * @property {Function} [onError] callback when a error is occured, this will override the onError specified on the Provider if any
 * @property {*} [initialData] initial data if no one is present in the cache before the request
 * @property {number} [pollingInterval] relaunch the request after the last success
 * @property {boolean} [enabled=true] launch request automatically (default true)
 * @property {boolean} [keepPreviousData=true] do we need to keep the previous data after reload (default true)
 */
interface UseDataLoaderConfig<T> {
  enabled?: boolean,
  initialData?: T,
  keepPreviousData?: boolean,
  onError?: (err: Error) => void| Promise<void>,
  onSuccess?: (data: T) => void | Promise<void>,
  pollingInterval?: number,
}

/**
 * @typedef {Object} UseDataLoaderResult
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
interface UseDataLoaderResult<T> {
  data?: T;
  error?: Error;
  isError: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isPolling: boolean;
  isSuccess: boolean;
  previousData?: T;
  reload: () => Promise<void>;
}

/**
 * @param {string} key key to save the data fetched in a local cache
 * @param {() => Promise} method a method that return a promise
 * @param {useDataLoaderConfig} config hook configuration
 * @returns {useDataLoaderResult} hook result containing data, request state, and method to reload the data
 */
const useDataLoader = <T>(
  fetchKey: string,
  method: () => Promise<T>,
  {
    enabled = true,
    initialData,
    keepPreviousData = true,
    onError,
    onSuccess,
    pollingInterval,
  }: UseDataLoaderConfig<T> = {},
): UseDataLoaderResult<T> => {
  const {
    addReload,
    clearReload,
    getCachedData,
    addCachedData,
    cacheKeyPrefix,
    onError: onErrorProvider,
  } = useDataLoaderContext()
  const [{ status, error }, dispatch] = useReducer(reducer, {
    error: undefined,
    status: StatusEnum.IDLE,
  })

  const addReloadRef = useRef(addReload)
  const clearReloadRef = useRef(clearReload)

  const key = useMemo(() => {
    if (!fetchKey || typeof fetchKey !== 'string') {
      return fetchKey
    }

    return `${cacheKeyPrefix ? `${cacheKeyPrefix}-` : ''}${fetchKey}`
  }, [cacheKeyPrefix, fetchKey])

  const previousDataRef = useRef<T>()

  const isLoading = useMemo(() => status === StatusEnum.LOADING, [status])
  const isIdle = useMemo(() => status === StatusEnum.IDLE, [status])
  const isSuccess = useMemo(() => status === StatusEnum.SUCCESS, [status])
  const isError = useMemo(() => status === StatusEnum.ERROR, [status])

  const isPolling = useMemo(
    () => !!(enabled && pollingInterval && (isSuccess || isLoading)) ?? false,
    [isSuccess, isLoading, enabled, pollingInterval],
  )

  const handleRequest = useCallback(
    async cacheKey => {
      try {
        dispatch(Actions.createOnLoading())
        const result = await method()

        if (keepPreviousData) {
          previousDataRef.current = getCachedData(cacheKey) as T
        }
        if (result !== undefined && result !== null && cacheKey)
          addCachedData(cacheKey, result)

        dispatch(Actions.createOnSuccess())

        await onSuccess?.(result)
      } catch (err) {
        dispatch(Actions.createOnError(err))
        await ((onError ?? onErrorProvider)?.(err))
      }
    },
    [
      addCachedData,
      getCachedData,
      keepPreviousData,
      method,
      onError,
      onErrorProvider,
      onSuccess,
    ],
  )

  const handleRequestRef = useRef(handleRequest)

  useEffect(() => {
    let handler: ReturnType<typeof setTimeout>

    async function fetch() {
      if (enabled) {
        if (isIdle) {
          await handleRequestRef.current(key)
        }
        if (pollingInterval && (isSuccess || isError)) {
          handler = setTimeout(
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            () => handleRequestRef.current(key),
            pollingInterval,
          )
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch()

    return () => {
      if (handler) clearTimeout(handler)
    }
  }, [key, pollingInterval, isIdle, isSuccess, isError, enabled])

  useLayoutEffect(() => {
    dispatch(Actions.createReset())
    if (key && typeof key === 'string') {
      addReloadRef.current?.(key, () =>
        handleRequestRef.current(key),
      )
    }

    return () => {
      if (key && typeof key === 'string') {
        clearReloadRef.current?.(key)
      }
    }
  }, [enabled, key])

  useLayoutEffect(() => {
    clearReloadRef.current = clearReload
    addReloadRef.current = addReload
  }, [clearReload, addReload])

  useLayoutEffect(() => {
    handleRequestRef.current = handleRequest
  }, [handleRequest])

  return {
    data: (getCachedData(key) || initialData) as T,
    error,
    isError,
    isIdle,
    isLoading,
    isPolling,
    isSuccess,
    previousData: previousDataRef.current,
    reload: () => handleRequestRef.current(key),
  }
}

export default useDataLoader
