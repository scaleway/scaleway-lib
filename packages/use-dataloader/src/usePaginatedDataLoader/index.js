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
  createOnUpdateData: data => ({
    type: ActionEnum.ON_UPDATE_DATA,
    data,
  }),
  createOnUpdatePageData: data => ({
    type: ActionEnum.ON_UPDATE_PAGE_DATA,
    data,
  }),
  createOnError: error => ({ type: ActionEnum.ON_ERROR, error }),
  createOnLoadMore: () => ({ type: ActionEnum.ON_LOAD_MORE }),
  createChangePage: page => ({ type: ActionEnum.CHANGE_PAGE, page }),
  createChangePageSize: pageSize => ({
    type: ActionEnum.CHANGE_PAGE_SIZE,
    pageSize,
  }),
  createOnEmptyData: () => ({ type: ActionEnum.ON_EMPTY_DATA }),
  createReset: () => ({ type: ActionEnum.RESET }),
}

const usePaginatedDataLoader = (
  key,
  method,
  {
    initialPage = 1,
    pageSize: initialPageSize = 25,
    onSuccess,
    onError,
    pollingInterval,
    enabled = true,
  },
) => {
  const {
    addReload,
    addCachedData,
    clearReload,
    getCachedData,
  } = useDataLoaderContext()
  const [
    {
      status,
      data,
      error,
      page,
      pageSize,
      canLoadMore,
      paginatedData,
      previousPage,
    },
    dispatch,
  ] = useReducer(reducer, {
    status: StatusEnum.IDLE,
    error: undefined,
    page: initialPage,
    data: [],
    pageSize: initialPageSize,
    paginatedData: {},
    canLoadMore: true,
    previousPage: initialPage,
  })

  const handlerRef = useRef()
  const methodRef = useRef(method)
  const pollingRef = useRef(pollingInterval)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)

  const isLoading = useMemo(() => status === StatusEnum.LOADING, [status])
  const isLoadingMore = useMemo(() => status === StatusEnum.LOAD_MORE, [status])
  const isIdle = useMemo(() => status === StatusEnum.IDLE, [status])
  const isSuccess = useMemo(() => status === StatusEnum.SUCCESS, [status])
  const isError = useMemo(() => status === StatusEnum.ERROR, [status])
  const isPolling = useMemo(
    () => !!handlerRef.current && (isSuccess || isLoading || isLoadingMore),
    [isSuccess, isLoading, isLoadingMore],
  )

  const lastPage = useMemo(() => Math.max(1, ...Object.keys(paginatedData)), [
    paginatedData,
  ])

  const updateData = useCallback(
    (newData, updateCache = true) => {
      dispatch(Actions.createOnUpdateData(newData))
      if (updateCache && key && newData) {
        addCachedData(`${key}-${page}`, newData)
      }
    },
    [key, addCachedData, page],
  )

  const handleRequest = useCallback(
    async ({ page: pageToQuery, key: cacheKey }) => {
      if (status === StatusEnum.LOADING || status === StatusEnum.LOAD_MORE) {
        return
      }
      if (
        cacheKey &&
        getCachedData(`${cacheKey}-${page}`) &&
        (!paginatedData[page] ||
          paginatedData[page] !== getCachedData(`${cacheKey}-${page}`))
      ) {
        dispatch(
          Actions.createOnUpdatePageData(getCachedData(`${cacheKey}-${page}`)),
        )
      }
      try {
        dispatch(
          status === StatusEnum.IDLE
            ? Actions.createOnLoading()
            : Actions.createOnLoadMore(),
        )
        const result = await methodRef.current?.({
          currentPage: pageToQuery,
          pageSize,
        })

        if (result && result.length > 0) {
          if (cacheKey) addCachedData(`${cacheKey}-${page}`, result)

          dispatch(Actions.createOnSuccess(result))
        } else {
          dispatch(Actions.createOnEmptyData())
        }

        await onSuccessRef.current?.(result)
      } catch (err) {
        dispatch(Actions.createOnError(err))
        await onErrorRef.current?.(err)
      }
    },
    [addCachedData, getCachedData, page, pageSize, paginatedData, status],
  )
  const handleRequestRef = useRef(handleRequest)

  const launchRequest = useCallback(
    async (pageToQuery = page) => {
      handleRequestRef.current({ page: pageToQuery, key })
      if (pollingRef.current) {
        handlerRef.current = setInterval(
          () => handleRequestRef.current({ page: pageToQuery, key }),
          pollingRef.current,
        )
      }
      if (key && typeof key === 'string') {
        clearReload(key)
        addReload(key, () => {
          dispatch(Actions.createReset())
          handleRequestRef.current({ page: pageToQuery, key })
        })
      }
    },
    [key, clearReload, addReload, page],
  )

  const reload = useCallback(() => {
    dispatch(Actions.createReset())
    launchRequest()
  }, [launchRequest])

  useEffect(() => {
    if (enabled && status === StatusEnum.IDLE) {
      launchRequest(initialPage)
    }
  }, [enabled, launchRequest, status, initialPage])

  const goToPage = useCallback(
    newPage => {
      if (newPage > 0 && newPage <= lastPage) {
        if (!paginatedData[newPage] || paginatedData[newPage]?.length === 0) {
          launchRequest(newPage)
        }
        dispatch(Actions.createChangePage(newPage))
      }
      if (canLoadMore && newPage > lastPage) {
        launchRequest(newPage)
        dispatch(Actions.createChangePage(newPage))
      }
    },
    [canLoadMore, lastPage, launchRequest, paginatedData],
  )

  useLayoutEffect(() => {
    if (methodRef.current !== method) {
      methodRef.current = method
    }
  }, [method])

  useLayoutEffect(() => {
    if (initialPageSize !== pageSize) {
      dispatch(Actions.createChangePageSize(initialPageSize))
    }
  }, [initialPageSize, pageSize])

  useLayoutEffect(() => {
    handleRequestRef.current = handleRequest
  }, [handleRequest])

  return {
    state: status,
    isLoading,
    isLoadingMore,
    isIdle,
    isSuccess,
    isError,
    isPolling,
    data,
    error,
    updateData,
    updatePageData: newData =>
      dispatch(Actions.createOnUpdatePageData(newData)),
    reloadPage: launchRequest,
    reload,
    goToPreviousPage: () => goToPage(previousPage),
    goToNextPage: () => goToPage(page + 1),
    goToPage,
    hasNextPage: canLoadMore,
    lastPage,
    firstPage: 1,
    isLastPage: page === lastPage,
    isFirstPage: page === 1,
    currentPage: page,
    previousPage: page,
    paginatedData,
    pageData: paginatedData[page],
    previousPageData: paginatedData[previousPage],
  }
}

export default usePaginatedDataLoader
