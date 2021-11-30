import { useCallback, useEffect, useState } from 'react'
import { KEY_IS_NOT_STRING_ERROR } from './constants'
import {
  PromiseType,
  UsePaginatedDataLoaderConfig,
  UsePaginatedDataLoaderMethodParams,
  UsePaginatedDataLoaderResult,
} from './types'
import useDataLoader from './useDataLoader'

/**
 * @param {string} baseFetchKey base key used to cache data. Hook append -page-X to that key for each page you load
 * @param {() => PromiseType} method a method that return a promise
 * @param {useDataLoaderConfig} config hook configuration
 * @returns {useDataLoaderResult} hook result containing data, request state, and method to reload the data
 */
const usePaginatedDataLoader = <T>(
  baseFetchKey: string,
  method: (params: UsePaginatedDataLoaderMethodParams) => PromiseType<T>,
  {
    enabled = true,
    initialData,
    keepPreviousData = true,
    onError,
    onSuccess,
    pollingInterval,
    maxDataLifetime,
    needPolling,
    initialPage,
    perPage = 1,
  }: UsePaginatedDataLoaderConfig<T> = {},
): UsePaginatedDataLoaderResult<T> => {
  if (typeof baseFetchKey !== 'string') {
    throw new Error(KEY_IS_NOT_STRING_ERROR)
  }

  const [data, setData] = useState<Record<number, T | undefined>>({})
  const [page, setPage] = useState<number>(initialPage ?? 1)

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
  } = useDataLoader(`${baseFetchKey}-page-${page}`, pageMethod, {
    enabled,
    initialData,
    keepPreviousData,
    maxDataLifetime,
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
  }, [baseFetchKey])

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
