import PropTypes from 'prop-types'
import React, {
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  DEFAULT_MAX_CONCURRENT_REQUESTS,
  KEY_IS_NOT_STRING_ERROR,
  StatusEnum,
} from './constants'
import DataLoader from './dataloader'
import { OnErrorFn, PromiseType } from './types'

type RequestQueue = Record<string, DataLoader>
type CachedData = Record<string, unknown>
type Reloads = Record<string, () => Promise<void | unknown>>

type UseDataLoaderInitializerArgs<T = unknown> = {
  enabled?: boolean
  status?: StatusEnum
  method: () => PromiseType<T>
  pollingInterval?: number
  keepPreviousData?: boolean
  /**
   * Max time before data from previous success is considered as outdated (in millisecond)
   */
  maxDataLifetime?: number
}

type GetCachedDataFn = {
  (): CachedData
  (key?: string): unknown | undefined
}

type GetReloadsFn = {
  (): Reloads
  (key?: string): (() => Promise<void | unknown>) | undefined
}

export interface IDataLoaderContext {
  addRequest: (key: string, args: UseDataLoaderInitializerArgs) => DataLoader
  cacheKeyPrefix?: string
  onError?: (error: Error) => void | Promise<void>
  clearAllCachedData: () => void
  clearCachedData: (key: string) => void
  clearRequest: (key: string) => void
  getCachedData: GetCachedDataFn
  getReloads: GetReloadsFn
  getRequest: (key: string) => DataLoader | undefined
  reload: (key?: string) => Promise<void>
  reloadAll: () => Promise<void>
}

// @ts-expect-error we force the context to undefined, should be corrected with default values
export const DataLoaderContext = createContext<IDataLoaderContext>(undefined)

const DataLoaderProvider = ({
  children,
  cacheKeyPrefix,
  onError,
  maxConcurrentRequests,
}: {
  children: ReactNode
  cacheKeyPrefix: string
  onError: OnErrorFn
  maxConcurrentRequests?: number
}): ReactElement => {
  const [requests, setRequests] = useState<RequestQueue>({})

  const computeKey = useCallback(
    (key: string) => `${cacheKeyPrefix ? `${cacheKeyPrefix}-` : ''}${key}`,
    [cacheKeyPrefix],
  )

  const addRequest = useCallback(
    (key: string, args: UseDataLoaderInitializerArgs) => {
      if (DataLoader.maxConcurrent !== maxConcurrentRequests) {
        DataLoader.maxConcurrent = maxConcurrentRequests as number
      }
      if (key && typeof key === 'string') {
        const notifyChanges = (updatedRequest: DataLoader) => {
          setRequests(current => ({
            ...current,
            [updatedRequest.key]: updatedRequest,
          }))
        }
        const newRequest = new DataLoader({
          ...args,
          key: computeKey(key),
          notify: notifyChanges,
        })
        setRequests(current => ({
          ...current,
          [newRequest.key]: newRequest,
        }))

        return newRequest
      }
      throw new Error(KEY_IS_NOT_STRING_ERROR)
    },
    [computeKey, maxConcurrentRequests],
  )

  const clearRequest = useCallback(
    (key: string) => {
      if (key && typeof key === 'string') {
        setRequests(current => {
          const newRequests = { ...current }
          delete newRequests[computeKey(key)]

          return newRequests
        })
      } else throw new Error(KEY_IS_NOT_STRING_ERROR)
    },
    [computeKey],
  )

  const getRequest = useCallback(
    (key: string) => requests[computeKey(key)],
    [computeKey, requests],
  )

  const clearCachedData = useCallback(
    (key: string) => {
      if (typeof key === 'string') {
        setRequests(current => ({
          ...current,
          [computeKey(key)]: {
            ...current[computeKey(key)],
            data: undefined,
          } as DataLoader,
        }))
      } else throw new Error(KEY_IS_NOT_STRING_ERROR)
    },
    [computeKey],
  )
  const clearAllCachedData = useCallback(() => {
    setRequests(current =>
      Object.entries(current).reduce(
        (acc, [key, request]) =>
          ({
            ...acc,
            [key]: {
              ...request,
              data: undefined,
            } as DataLoader,
          } as RequestQueue),
        {},
      ),
    )
  }, [])

  const reload = useCallback(
    async (key?: string) => {
      if (key && typeof key === 'string') {
        await getRequest(key)?.load(true)
      } else throw new Error(KEY_IS_NOT_STRING_ERROR)
    },
    [getRequest],
  )

  const reloadAll = useCallback(async () => {
    await Promise.all(
      Object.values(requests).map(request => request.load(true)),
    )
  }, [requests])

  const getCachedData = useCallback(
    (key?: string) => {
      if (key) {
        return getRequest(key)?.data
      }

      return Object.entries(requests).reduce(
        (acc, [requestKey, { data }]) => ({
          ...acc,
          [requestKey]: data,
        }),
        {} as CachedData,
      )
    },
    [getRequest, requests],
  )

  const getReloads = useCallback(
    (key?: string) => {
      if (key) {
        return getRequest(key) ? () => getRequest(key).load(true) : undefined
      }

      return Object.entries(requests).reduce(
        (acc, [requestKey, { load }]) => ({
          ...acc,
          [requestKey]: () => load(true),
        }),
        {} as Reloads,
      )
    },
    [getRequest, requests],
  )

  const value = useMemo(
    () => ({
      addRequest,
      cacheKeyPrefix,
      clearAllCachedData,
      clearCachedData,
      clearRequest,
      getCachedData,
      getReloads,
      getRequest,
      onError,
      reload,
      reloadAll,
    }),
    [
      addRequest,
      cacheKeyPrefix,
      clearAllCachedData,
      clearCachedData,
      getCachedData,
      getRequest,
      getReloads,
      onError,
      reload,
      reloadAll,
      clearRequest,
    ],
  )

  return (
    <DataLoaderContext.Provider value={value as IDataLoaderContext}>
      {children}
    </DataLoaderContext.Provider>
  )
}

DataLoaderProvider.propTypes = {
  cacheKeyPrefix: PropTypes.string,
  children: PropTypes.node.isRequired,
  maxConcurrentRequests: PropTypes.number,
  onError: PropTypes.func,
}

DataLoaderProvider.defaultProps = {
  cacheKeyPrefix: undefined,
  maxConcurrentRequests: DEFAULT_MAX_CONCURRENT_REQUESTS,
  onError: undefined,
}

export const useDataLoaderContext = (): IDataLoaderContext =>
  useContext(DataLoaderContext)

export default DataLoaderProvider
