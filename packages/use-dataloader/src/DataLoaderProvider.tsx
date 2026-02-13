// oxlint-disable only-export-components
import type { ComponentType, Context, ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useRef } from 'react'
import { DEFAULT_MAX_CONCURRENT_REQUESTS } from './constants'
import DataLoader from './dataloader'
import { marshalQueryKey } from './helpers'
import type { KeyType, OnErrorFn, PromiseType } from './types'

type CachedData = Record<string, unknown>
type Reloads = Record<string, () => Promise<void | unknown>>
type Requests = Record<string, DataLoader<unknown, unknown>>

type UseDataLoaderInitializerArgs<ResultType = unknown> = {
  method: () => PromiseType<ResultType>
  enabled?: boolean
}

type GetCachedDataFn = {
  (): CachedData
  (key?: KeyType): unknown | undefined
}

type GetReloadsFn = {
  (): Reloads
  (key?: KeyType): (() => Promise<void | unknown>) | undefined
}

export type IDataLoaderContext = {
  addRequest: <ResultType, ErrorType>(
    key: KeyType,
    args: UseDataLoaderInitializerArgs<ResultType>,
  ) => DataLoader<ResultType, ErrorType>
  getOrAddRequest: <ResultType, ErrorType>(
    key: KeyType,
    args: UseDataLoaderInitializerArgs<ResultType>,
  ) => DataLoader<ResultType, ErrorType>
  computeKey: (key: KeyType) => string
  cacheKeyPrefix?: string
  defaultDatalifetime?: number
  onError?: (error: Error) => void | Promise<void>
  clearAllCachedData: () => void
  clearCachedData: (key: KeyType) => void
  getCachedData: GetCachedDataFn
  getReloads: GetReloadsFn
  getRequest: <ResultType, ErrorType>(
    key: KeyType,
  ) => DataLoader<ResultType, ErrorType>
  reload: (key: KeyType) => Promise<void>
  reloadAll: () => Promise<void>
  reloadAllActive: () => Promise<void>
  reloadGroup: (startKey: KeyType) => Promise<void>
  reloadGroupActive: (startKey: KeyType) => Promise<void>
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
    (key: KeyType) =>
      marshalQueryKey([cacheKeyPrefix, ...(Array.isArray(key) ? key : [key])]),
    [cacheKeyPrefix],
  )

  const getRequest = useCallback(
    (key: KeyType): DataLoader<unknown, unknown> | undefined =>
      requestsRef.current[computeKey(key)],
    [computeKey],
  )

  const addRequest = useCallback(
    (key: KeyType, args: UseDataLoaderInitializerArgs) => {
      if (DataLoader.maxConcurrent !== maxConcurrentRequests) {
        DataLoader.maxConcurrent = maxConcurrentRequests
      }
      const newRequest = new DataLoader({
        ...args,
        key: computeKey(key),
      })

      requestsRef.current[newRequest.key] = newRequest

      return newRequest
    },
    [computeKey, maxConcurrentRequests],
  )

  const getOrAddRequest = useCallback(
    (key: KeyType, args: UseDataLoaderInitializerArgs) => {
      const requestFound = getRequest(key)
      if (!requestFound) {
        return addRequest(key, args)
      }

      return requestFound
    },
    [addRequest, getRequest],
  )

  const clearCachedData = useCallback(
    (key: KeyType) => {
      getRequest(key)?.clearData()
    },
    [getRequest],
  )
  const clearAllCachedData = useCallback(() => {
    const requests = Object.values(requestsRef.current)
    for (const request of requests) {
      request.clearData()
    }
  }, [])

  const reload = useCallback(
    async (key: KeyType) => {
      await getRequest(key)?.load(true)
    },
    [getRequest],
  )

  const reloadGroup = useCallback(
    async (startPrefix: KeyType) => {
      await Promise.all(
        Object.values(requestsRef.current)
          .filter(request => request.key.startsWith(computeKey(startPrefix)))
          .map(async request => request.load(true)),
      )
    },
    [computeKey],
  )

  const reloadAll = useCallback(async () => {
    await Promise.all(
      Object.values(requestsRef.current).map(async request =>
        request.load(true),
      ),
    )
  }, [])

  const reloadGroupActive = useCallback(
    async (startPrefix: KeyType) => {
      await Promise.all(
        Object.values(requestsRef.current)
          .filter(
            request =>
              request.observers.length > 0 &&
              request.key.startsWith(computeKey(startPrefix)),
          )
          .map(async request => request.load(true)),
      )
    },
    [computeKey],
  )

  const reloadAllActive = useCallback(async () => {
    await Promise.all(
      Object.values(requestsRef.current)
        .filter(request => request.observers.length > 0)
        .map(async request => request.load(true)),
    )
  }, [])

  const getCachedData = useCallback(
    (key?: KeyType) => {
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
    (key?: KeyType) => {
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
    (): IDataLoaderContext => ({
      addRequest: addRequest as IDataLoaderContext['addRequest'],
      cacheKeyPrefix,
      clearAllCachedData,
      clearCachedData,
      computeKey,
      defaultDatalifetime,
      getCachedData: getCachedData as IDataLoaderContext['getCachedData'],
      getOrAddRequest: getOrAddRequest as IDataLoaderContext['getOrAddRequest'],
      getReloads: getReloads as IDataLoaderContext['getReloads'],
      getRequest: getRequest as IDataLoaderContext['getRequest'],
      onError,
      reload,
      reloadAll,
      reloadAllActive,
      reloadGroup,
      reloadGroupActive,
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
      reloadAllActive,
      reloadGroupActive,
    ],
  )

  return (
    <DataLoaderContext.Provider value={value}>
      {children}
    </DataLoaderContext.Provider>
  )
}

export const useDataLoaderContext = (): IDataLoaderContext =>
  useContext(DataLoaderContext)

export default DataLoaderProvider
