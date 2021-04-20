import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { useDataLoaderContext } from '../DataLoaderProvider'
import { ActionEnum, StatusEnum } from './constants'
import reducer from './reducer'

const Actions = {
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
    reloadOnKeyChange = false,
  },
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

  const keyRef = useRef(key)
  const handlerRef = useRef()
  const methodRef = useRef(method)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)

  const isLoading = useMemo(() => status === StatusEnum.LOADING, [status])
  const isIdle = useMemo(() => status === StatusEnum.IDLE, [status])
  const isSuccess = useMemo(() => status === StatusEnum.SUCCESS, [status])
  const isError = useMemo(() => status === StatusEnum.ERROR, [status])
  const isPolling = useMemo(
    () => handlerRef.current && (isSuccess || isLoading),
    [isSuccess, isLoading],
  )

  const updateData = useCallback(
    (newData, updateCache = true) => {
      dispatch(Actions.createOnUpdateData(newData))
      if (updateCache && key && newData) {
        addCachedData(key, newData)
      }
    },
    [addCachedData, key],
  )

  const handleRequest = useCallback(
    async (cacheKey, args) => {
      if (cacheKey && !data && getCachedData(cacheKey)) {
        dispatch(Actions.createOnUpdateData(getCachedData(cacheKey)))
      }
      if (status === StatusEnum.LOADING) {
        return
      }
      try {
        dispatch(Actions.createOnLoading())
        const result = await methodRef.current?.(args)

        if (result && cacheKey) addCachedData(cacheKey, result)

        dispatch(Actions.createOnSuccess(result))

        await onSuccessRef.current?.(result)
      } catch (err) {
        dispatch(Actions.createOnError(err))
        await onErrorRef.current?.(err)
      }
    },
    [addCachedData, data, getCachedData, status],
  )

  const launchRequest = useCallback(
    args => {
      handleRequest(key, args)
      if (pollingInterval) {
        if (handlerRef.current) {
          clearInterval(handlerRef.current)
        }

        handlerRef.current = setInterval(
          () => handleRequest(args),
          pollingInterval,
        )
      }
      if (key && typeof key === 'string') {
        clearReload(key)
        addReload(key, reloadArgs => handleRequest(key, reloadArgs))
      }
    },
    [addReload, handleRequest, clearReload, key, pollingInterval],
  )

  useEffect(() => {
    if (enabled && status === StatusEnum.IDLE) launchRequest()
    // Why can't put empty array for componentDidMount, componentWillUnmount ??? No array act like componentDidMount and componentDidUpdate
  }, [enabled, launchRequest, status])

  useEffect(() => {
    if (enabled && reloadOnKeyChange && key !== keyRef.current) {
      keyRef.current = key
      launchRequest()
    }
  }, [enabled, launchRequest, status, key, reloadOnKeyChange])

  useLayoutEffect(() => {
    methodRef.current = method
  }, [method])

  return {
    state: status,
    isLoading,
    isIdle,
    isSuccess,
    isError,
    isPolling,
    data,
    error,
    updateData,
    reload: launchRequest,
  }
}

export default useDataLoader
