import PropTypes from 'prop-types'
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react'

type CachedData = Record<string, unknown>
type Reloads = Record<string, () => Promise<void>>

interface DataLoaderContextType {
  addCachedData: (key: string, newData: unknown) => void;
  addReload: (key: string, method: () => Promise<void>) => void;
  cacheKeyPrefix: string;
  clearAllCachedData: () => void;
  clearAllReloads: () => void;
  clearCachedData: (key?: string) => void;
  clearReload: (key?: string) => void,
  getCachedData: (key?: string) => Promise<void> | CachedData,
  getReloads: (key?: string) => () => Promise<void> | Reloads,
  reload: (key?: string) => Promise<void>,
  reloadAll: () => Promise<void>,
}

export const DataLoaderContext = createContext<DataLoaderContextType>({})

const DataLoaderProvider = ({ children, cacheKeyPrefix }: { children: ReactNode, cacheKeyPrefix: string }): JSX.Element => {
  const cachedData = useRef<CachedData>({})
  const reloads = useRef<Reloads>({})

  const setCachedData = useCallback((compute: ((data: CachedData) => CachedData) | CachedData) => {
    if (typeof compute === 'function') {
      cachedData.current = compute(cachedData.current)
    } else {
      cachedData.current = compute
    }
  }, [])

  const setReloads = useCallback((compute: ((reloads: Reloads) => Reloads) | Reloads) => {
    if (typeof compute === 'function') {
      reloads.current = compute(reloads.current)
    } else {
      reloads.current = compute
    }
  }, [])

  const addCachedData = useCallback(
    (key: string, newData: unknown) => {
      if (key && typeof key === 'string' && newData) {
        setCachedData((actualCachedData: CachedData) => ({
          ...actualCachedData,
          [key]: newData,
        }))
      }
    },
    [setCachedData],
  )

  const addReload = useCallback(
    (key: string, method: () => Promise<void>) => {
      if (key && typeof key === 'string' && method) {
        setReloads((actualReloads: Reloads) => ({
          ...actualReloads,
          [key]: method,
        }))
      }
    },
    [setReloads],
  )

  const clearReload = useCallback(
    (key?: string) => {
      if (key && typeof key === 'string') {
        setReloads((actualReloads: Reloads) => {
          const tmp = actualReloads
          delete tmp[key]

          return tmp
        })
      }
    },
    [setReloads],
  )

  const clearAllReloads = useCallback(() => {
    setReloads({})
  }, [setReloads])

  const clearCachedData = useCallback(
    (key?: string) => {
      if (key && typeof key === 'string') {
        setCachedData((actualCachedData: CachedData) => {
          const tmp = actualCachedData
          delete tmp[key]

          return tmp
        })
      }
    },
    [setCachedData],
  )
  const clearAllCachedData = useCallback(() => {
    setCachedData({})
  }, [setCachedData])

  const reload = useCallback(async (key?: string) => {
    if (key && typeof key === 'string') {
      await (reloads.current[key] && reloads.current[key]())
    }
  }, [])

  const reloadAll = useCallback(async () => {
    await Promise.all(
      Object.values(reloads.current).map(reloadFn => reloadFn()),
    )
  }, [])

  const getCachedData = useCallback((key?: string) => {
    if (key) {
      return cachedData.current[key] || undefined
    }

    return cachedData.current
  }, [])

  const getReloads = useCallback((key?: string) => {
    if (key) {
      return reloads.current[key] || undefined
    }

    return reloads.current
  }, [])

  const value = useMemo(
    () => ({
      addCachedData,
      addReload,
      cacheKeyPrefix,
      clearAllCachedData,
      clearAllReloads,
      clearCachedData,
      clearReload,
      getCachedData,
      getReloads,
      reload,
      reloadAll,
    }),
    [
      addCachedData,
      addReload,
      cacheKeyPrefix,
      clearAllCachedData,
      clearAllReloads,
      clearCachedData,
      clearReload,
      getCachedData,
      getReloads,
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
}

DataLoaderProvider.defaultProps = {
  cacheKeyPrefix: undefined,
}

export const useDataLoaderContext = (): DataLoaderContextType => useContext(DataLoaderContext)

export default DataLoaderProvider
