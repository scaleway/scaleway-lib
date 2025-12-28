import type { ComponentType, Context, ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useRef } from 'react'
import {
  DEFAULT_MAX_CONCURRENT_REQUESTS,
  KEY_IS_NOT_STRING_ERROR,
} from './constants'
import DataLoader from './dataloader'
import { marshalQueryKey } from './helpers'
import type { OnErrorFn, PromiseType } from './types'

type CachedData = Record<string, unknown>
type Reloads = Record<string, () => Promise<void | unknown>>
type Requests = Record<string, DataLoader<unknown, unknown>>

type UseDataLoaderInitializerArgs<ResultType = unknown> = {
  method: () => PromiseType<ResultType>
  enabled?: boolean
}

type GetCachedDataFn = {
  (): CachedData
  (key?: string): unknown | undefined
}

type GetReloadsFn = {
  (): Reloads
  (key?: string): (() => Promise<void | unknown>) | undefined
}

export type IDataLoaderContext = {
  addRequest: <ResultType, ErrorType>(
    key: string,
    args: UseDataLoaderInitializerArgs<ResultType>,
  ) => DataLoader<ResultType, ErrorType>
  getOrAddRequest: <ResultType, ErrorType>(
    key: string,
    args: UseDataLoaderInitializerArgs<ResultType>,
  ) => DataLoader<ResultType, ErrorType>
  computeKey: (key: string) => string
  cacheKeyPrefix?: string
  defaultDatalifetime?: number
  onError?: (error: Error) => void | Promise<void>
  clearAllCachedData: () => void
  clearCachedData: (key: string) => void
  getCachedData: GetCachedDataFn
  getReloads: GetReloadsFn
  getRequest: <ResultType, ErrorType>(
    key: string,
  ) => DataLoader<ResultType, ErrorType>
  reload: (key?: string) => Promise<void>
  reloadAll: () => Promise<void>
  reloadGroup: (startKey?: string) => Promise<void>
}

export const DataLoaderContext: Context<IDataLoaderContext> =
  // @ts-expect-error we force the context to undefined, should be corrected with default values
  createContext<IDataLoaderContext>(undefined)

type DataLoaderProviderProps = {
  children: ReactNode
  cacheKeyPrefix?: string
  onError?: OnErrorFn
  maxConcurrentRequests?: number
  /**
   * Default request lifetime in milliseconds. It doesnt override values passed to hooks
   */
  defaultDatalifetime?: number
}

const DataLoaderProvider: ComponentType<DataLoaderProviderProps> = ({
  children,
  cacheKeyPrefix,
  onError,
  maxConcurrentRequests = DEFAULT_MAX_CONCURRENT_REQUESTS,
  defaultDatalifetime,
}) => {
  const requestsRef = useRef<Requests>({})

  const computeKey = useCallback(
    (key: string) => marshalQueryKey([cacheKeyPrefix, key]),
    [cacheKeyPrefix],
  )

  const getRequest = useCallback(
    (key: string): DataLoader<unknown, unknown> | undefined =>
      requestsRef.current[computeKey(key)],
    [computeKey],
  )

  const addRequest = useCallback(
    (key: string, args: UseDataLoaderInitializerArgs) => {
      if (DataLoader.maxConcurrent !== maxConcurrentRequests) {
        DataLoader.maxConcurrent = maxConcurrentRequests
      }
      if (key && typeof key === 'string') {
        const newRequest = new DataLoader({
          ...args,
          key: computeKey(key),
        })

        requestsRef.current[newRequest.key] = newRequest

        return newRequest
      }
      throw new Error(KEY_IS_NOT_STRING_ERROR)
    },
    [computeKey, maxConcurrentRequests],
  )

  const getOrAddRequest = useCallback(
    (key: string, args: UseDataLoaderInitializerArgs) => {
      const requestFound = getRequest(key)
      if (!requestFound) {
        return addRequest(key, args)
      }

      return requestFound
    },
    [addRequest, getRequest],
  )

  const clearCachedData = useCallback(
    (key: string) => {
      if (key && typeof key === 'string') {
        getRequest(key)?.clearData()
      } else {
        throw new Error(KEY_IS_NOT_STRING_ERROR)
      }
    },
    [getRequest],
  )
  const clearAllCachedData = useCallback(() => {
    Object.values(requestsRef.current).forEach(request => {
      request.clearData()
    })
  }, [])

  const reload = useCallback(
    async (key?: string) => {
      if (key && typeof key === 'string') {
        await getRequest(key)?.load(true)
      } else {
        throw new Error(KEY_IS_NOT_STRING_ERROR)
      }
    },
    [getRequest],
  )

  const reloadGroup = useCallback(async (startPrefix?: string) => {
    if (startPrefix && typeof startPrefix === 'string') {
      await Promise.all(
        Object.values(requestsRef.current)
          .filter(request => request.key.startsWith(startPrefix))
          .map(async request => request.load(true)),
      )
    } else {
      throw new Error(KEY_IS_NOT_STRING_ERROR)
    }
  }, [])

  const reloadAll = useCallback(async () => {
    await Promise.all(
      Object.values(requestsRef.current).map(async request =>
        request.load(true),
      ),
    )
  }, [])

  const getCachedData = useCallback(
    (key?: string) => {
      if (key) {
        return getRequest(key)?.getData()
      }

      return Object.values(requestsRef.current).reduce<CachedData>(
        (acc, request) => ({
          ...acc,
          [request.key]: request.getData(),
        }),
        {},
      )
    },
    [getRequest],
  )

  const getReloads = useCallback(
    (key?: string) => {
      if (key) {
        return getRequest(key)
          ? async () => getRequest(key)?.load(true)
          : undefined
      }

      return Object.entries(requestsRef.current).reduce<Reloads>(
        (acc, [requestKey, { load }]) => ({
          ...acc,
          [requestKey]: async () => load(true),
        }),
        {},
      )
    },
    [getRequest],
  )

  const value = useMemo(
    () => ({
      addRequest,
      cacheKeyPrefix,
      clearAllCachedData,
      clearCachedData,
      computeKey,
      defaultDatalifetime,
      getCachedData,
      getOrAddRequest,
      getReloads,
      getRequest,
      onError,
      reload,
      reloadAll,
      reloadGroup,
    }),
    [
      addRequest,
      cacheKeyPrefix,
      clearAllCachedData,
      clearCachedData,
      getCachedData,
      getOrAddRequest,
      getRequest,
      getReloads,
      onError,
      reload,
      reloadAll,
      reloadGroup,
      computeKey,
      defaultDatalifetime,
    ],
  )

  return (
    <DataLoaderContext.Provider value={value as IDataLoaderContext}>
      {children}
    </DataLoaderContext.Provider>
  )
}

export const useDataLoaderContext = (): IDataLoaderContext =>
  useContext(DataLoaderContext)

export default DataLoaderProvider
