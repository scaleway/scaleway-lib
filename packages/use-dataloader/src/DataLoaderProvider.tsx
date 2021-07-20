import PropTypes from 'prop-types'
import React, {
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react'

interface Context {
  addCachedData: (key: string, newData: unknown) => void;
  addReload: (key: string, method: () => Promise<void>) => void;
  cacheKeyPrefix: string;
  clearAllCachedData: () => void;
  clearAllReloads: () => void;
  clearCachedData: (key?: string | undefined) => void;
  clearReload: (key?: string | undefined) => void;
  getCachedData: (key?: string | undefined) => unknown;
  getReloads: (key?: string | undefined) => (() => Promise<void>) | Reloads;
  reload: (key?: string | undefined) => Promise<void>;
  reloadAll: () => Promise<void>;
}

type CachedData = Record<string, unknown>
type Reloads = Record<string, () => Promise<void>>

// @ts-expect-error we force the context to undefined, should be corrected with default values
export const DataLoaderContext = createContext<Context>(undefined)

const DataLoaderProvider = ({ children, cacheKeyPrefix }: {
  children: ReactNode, cacheKeyPrefix: string
}): ReactElement => {
  const cachedData = useRef<CachedData>({})
  const reloads = useRef<Reloads>({})

  const setCachedData = useCallback((compute: CachedData | ((data: CachedData) => CachedData)) => {
    if (typeof compute === 'function') {
      cachedData.current = compute(cachedData.current)
    } else {
      cachedData.current = compute
    }
  }, [])

  const setReloads = useCallback((compute: Reloads | ((data: Reloads) => Reloads)) => {
    if (typeof compute === 'function') {
      reloads.current = compute(reloads.current)
    } else {
      reloads.current = compute
    }
  }, [])

  const addCachedData = useCallback(
    (key: string, newData: unknown) => {
      if (key && typeof key === 'string' && newData) {
        setCachedData(actualCachedData => ({
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
        setReloads(actualReloads => ({
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
        setReloads(actualReloads => {
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
        setCachedData(actualCachedData => {
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

export const useDataLoaderContext = (): Context => useContext(DataLoaderContext)

export default DataLoaderProvider
