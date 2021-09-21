import PropTypes from 'prop-types'
import React, {
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import DataLoader from './dataloader'
import { DataLoaderStatus, OnErrorFn, PromiseType } from './types'

type RequestQueue = Record<string, DataLoader>
type CachedData = Record<string, unknown>
type Reloads = Record<string, () => Promise<void | unknown>>

type UseDataLoaderInitializerArgs<T = unknown> = {
  enabled?: boolean
  key: string
  status?: DataLoaderStatus
  method: () => PromiseType<T>
  pollingInterval?: number
  keepPreviousData?: boolean
}

interface Context {
  addCachedData: (key: string, newData: unknown) => void
  addReload: (key: string, method: () => Promise<void | unknown>) => void
  addRequest: (key: string, args: UseDataLoaderInitializerArgs) => DataLoader
  cacheKeyPrefix: string
  onError?: (error: Error) => void | Promise<void>
  clearAllCachedData: () => void
  clearAllReloads: () => void
  clearCachedData: (key?: string) => void
  clearReload: (key?: string) => void
  getCachedData: (key?: string) => unknown | CachedData
  getReloads: (key?: string) => (() => Promise<void | unknown>) | Reloads
  getRequest: (key: string) => DataLoader | undefined
  reload: (key?: string) => Promise<void>
  reloadAll: () => Promise<void>
}

// @ts-expect-error we force the context to undefined, should be corrected with default values
export const DataLoaderContext = createContext<Context>(undefined)

const DataLoaderProvider = ({
  children,
  cacheKeyPrefix,
  onError,
}: {
  children: ReactNode
  cacheKeyPrefix: string
  onError: OnErrorFn
}): ReactElement => {
  const [requestQueue, setRequestQueue] = useState({} as RequestQueue)
  const [cachedData, setCachedDataPrivate] = useState<CachedData>({})
  const reloads = useRef<Reloads>({})

  const computeKey = useCallback(
    (key: string) => `${cacheKeyPrefix ? `${cacheKeyPrefix}-` : ''}${key}`,
    [cacheKeyPrefix],
  )

  const setCachedData = useCallback(
    (compute: CachedData | ((data: CachedData) => CachedData)) => {
      if (typeof compute === 'function') {
        setCachedDataPrivate(current => compute(current))
      } else {
        setCachedDataPrivate(compute)
      }
    },
    [],
  )

  const setReloads = useCallback(
    (compute: Reloads | ((data: Reloads) => Reloads)) => {
      if (typeof compute === 'function') {
        reloads.current = compute(reloads.current)
      } else {
        reloads.current = compute
      }
    },
    [],
  )

  const addCachedData = useCallback(
    (key: string, newData: unknown) => {
      if (key && typeof key === 'string' && newData) {
        setCachedData(actualCachedData => ({
          ...actualCachedData,
          [computeKey(key)]: newData,
        }))
      }
    },
    [setCachedData, computeKey],
  )

  const addReload = useCallback(
    (key: string, method: () => Promise<void | unknown>) => {
      if (key && method && typeof key === 'string') {
        setReloads(actualReloads => ({
          ...actualReloads,
          [computeKey(key)]: method,
        }))
      }
    },
    [setReloads, computeKey],
  )

  const addRequest = useCallback(
    (key: string, args: UseDataLoaderInitializerArgs) => {
      if (key && typeof key === 'string') {
        const notifyChanges = (updatedRequest: DataLoader) => {
          setRequestQueue(current => ({
            ...current,
            [computeKey(updatedRequest.key)]: updatedRequest,
          }))
        }
        const newRequest = new DataLoader({ ...args, notify: notifyChanges })
        newRequest.addOnSuccessListener(result => {
          if (result !== undefined && result !== null)
            addCachedData(key, result)
        })
        setRequestQueue(current => ({
          ...current,
          [computeKey(key)]: newRequest,
        }))

        addReload(key, newRequest.launch)

        return newRequest
      }
      throw new Error('Key should be a string')
    },
    [computeKey, addCachedData, addReload],
  )

  const getRequest = useCallback(
    (key: string) => requestQueue[computeKey(key)],
    [computeKey, requestQueue],
  )

  const clearReload = useCallback(
    (key?: string) => {
      if (key && typeof key === 'string') {
        setReloads(actualReloads => {
          const tmp = actualReloads
          delete tmp[computeKey(key)]

          return tmp
        })
      }
    },
    [setReloads, computeKey],
  )

  const clearAllReloads = useCallback(() => {
    setReloads({})
  }, [setReloads])

  const clearCachedData = useCallback(
    (key?: string) => {
      if (key && typeof key === 'string') {
        setCachedData(actualCachedData => {
          const tmp = actualCachedData
          delete tmp[computeKey(key)]

          return tmp
        })
      }
    },
    [setCachedData, computeKey],
  )
  const clearAllCachedData = useCallback(() => {
    setCachedData({})
  }, [setCachedData])

  const reload = useCallback(
    async (key?: string) => {
      if (key && typeof key === 'string') {
        await (reloads.current[computeKey(key)] &&
          reloads.current[computeKey(key)]())
      }
    },
    [computeKey],
  )

  const reloadAll = useCallback(async () => {
    await Promise.all(
      Object.values(reloads.current).map(reloadFn => reloadFn()),
    )
  }, [])

  const getCachedData = useCallback(
    (key?: string) => {
      if (key) {
        return cachedData[computeKey(key)] || undefined
      }

      return cachedData
    },
    [computeKey, cachedData],
  )

  const getReloads = useCallback(
    (key?: string) => {
      if (key) {
        return reloads.current[computeKey(key)] || undefined
      }

      return reloads.current
    },
    [computeKey],
  )

  const value = useMemo(
    () => ({
      addCachedData,
      addReload,
      addRequest,
      cacheKeyPrefix,
      clearAllCachedData,
      clearAllReloads,
      clearCachedData,
      clearReload,
      getCachedData,
      getReloads,
      getRequest,
      onError,
      reload,
      reloadAll,
    }),
    [
      addCachedData,
      addReload,
      addRequest,
      cacheKeyPrefix,
      clearAllCachedData,
      clearAllReloads,
      clearCachedData,
      clearReload,
      getCachedData,
      getRequest,
      getReloads,
      onError,
      reload,
      reloadAll,
    ],
  )

  return (
    <DataLoaderContext.Provider value={value}>
      {children}
    </DataLoaderContext.Provider>
  )
}

DataLoaderProvider.propTypes = {
  cacheKeyPrefix: PropTypes.string,
  children: PropTypes.node.isRequired,
  onError: PropTypes.func,
}

DataLoaderProvider.defaultProps = {
  cacheKeyPrefix: undefined,
  onError: undefined,
}

export const useDataLoaderContext = (): Context => useContext(DataLoaderContext)

export default DataLoaderProvider
