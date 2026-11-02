import type { ComponentType, ReactNode } from 'react'
import { useCallback, useMemo, useRef } from 'react'
import { DEFAULT_MAX_CONCURRENT_REQUESTS } from './constants'
import DataLoader from './dataloader'
import { marshalQueryKey } from './helpers'
import type { KeyType, OnErrorFn } from './types'
import type { CachedData, IDataLoaderContext, Reloads, UseDataLoaderInitializerArgs } from './useDataLoaderContext'
import { DataLoaderContext } from './useDataLoaderContext'

type Requests = Record<string, DataLoader<unknown, unknown>>

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
    (key: KeyType) => marshalQueryKey([cacheKeyPrefix, ...(Array.isArray(key) ? key : [key])]),
    [cacheKeyPrefix],
  )

  const getRequest = useCallback(
    (key: KeyType): DataLoader<unknown, unknown> | undefined => requestsRef.current[computeKey(key)],
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
    await Promise.all(Object.values(requestsRef.current).map(async request => request.load(true)))
  }, [])

  const reloadGroupActive = useCallback(
    async (startPrefix: KeyType) => {
      await Promise.all(
        Object.values(requestsRef.current)
          .filter(request => request.observers.length > 0 && request.key.startsWith(computeKey(startPrefix)))
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
      if (key !== undefined) {
        return getRequest(key)?.getData()
      }
      return Object.fromEntries(
        Object.values(requestsRef.current).map(request => [request.key, request.getData()]),
      ) satisfies CachedData
    },
    [getRequest],
  )

  const getReloads = useCallback(
    (key?: KeyType) => {
      if (key !== undefined) {
        return getRequest(key) ? async () => getRequest(key)?.load(true) : undefined
      }
      return Object.fromEntries(
        Object.entries(requestsRef.current).map(([requestKey, { load }]) => [requestKey, async () => load(true)]),
      ) satisfies Reloads
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

  return <DataLoaderContext.Provider value={value}>{children}</DataLoaderContext.Provider>
}

export default DataLoaderProvider
