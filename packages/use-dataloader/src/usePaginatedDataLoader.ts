import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  KeyType,
  PromiseType,
  UsePaginatedDataLoaderConfig,
  UsePaginatedDataLoaderMethodParams,
  UsePaginatedDataLoaderResult,
} from './types'
import useDataLoader from './useDataLoader'

/**
 * @param {KeyType} key base key used to cache data. Hook append -page-X to that key for each page you load
 * @param {() => PromiseType} method a method that return a promise
 * @param {useDataLoaderConfig} config hook configuration
 * @returns {useDataLoaderResult} hook result containing data, request state, and method to reload the data
 */
const usePaginatedDataLoader = <ResultType = unknown, ErrorType = Error>(
  key: KeyType,
  method: (
    params: UsePaginatedDataLoaderMethodParams,
  ) => PromiseType<ResultType>,
  {
    enabled = true,
    initialData,
    keepPreviousData = true,
    onError,
    onSuccess,
    pollingInterval,
    dataLifetime,
    needPolling,
    initialPage,
    perPage = 1,
  }: UsePaginatedDataLoaderConfig<ResultType, ErrorType> = {},
): UsePaginatedDataLoaderResult<ResultType, ErrorType> => {
  const [data, setData] = useState<Record<number, ResultType | undefined>>({})
  const [page, setPage] = useState<number>(initialPage ?? 1)

  const keyPage = useMemo(() => [key, ['page', page]].flat(), [key, page])

  const pageMethod = useCallback(
    () => method({ page, perPage }),
    [method, page, perPage],
  )
  const {
    data: pageData,
    isError,
    isIdle,
    isLoading,
    isPolling,
    isSuccess,
    reload,
    error,
  } = useDataLoader(keyPage, pageMethod, {
    dataLifetime,
    enabled,
    initialData,
    keepPreviousData,
    needPolling,
    onError,
    onSuccess,
    pollingInterval,
  })

  const goToNextPage = useCallback(() => {
    setPage(current => current + 1)
  }, [])

  const goToPreviousPage = useCallback(() => {
    setPage(current => (current > 1 ? current - 1 : 1))
  }, [])

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage > 1 ? newPage : 1)
  }, [])

  useEffect(() => {
    setData(current => {
      if (pageData !== current[page]) {
        return { ...current, [page]: pageData }
      }

      return current
    })
  }, [pageData, page])

  useEffect(() => {
    setPage(1)
    setData({})
  }, [key])

  return {
    data,
    error,
    goToNextPage,
    goToPage,
    goToPreviousPage,
    isError,
    isIdle,
    isLoading,
    isPolling,
    isSuccess,
    page,
    pageData,
    reload,
  }
}

export default usePaginatedDataLoader
