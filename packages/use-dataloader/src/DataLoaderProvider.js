import PropTypes from 'prop-types'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react'

export const DataLoaderContext = createContext()

const DataLoaderProvider = ({ children, cacheKeyPrefix }) => {
  const cachedData = useRef({})
  const reloads = useRef({})

  const setCachedData = useCallback(compute => {
    if (typeof compute === 'function') {
      cachedData.current = compute(cachedData.current)
    } else {
      cachedData.current = compute
    }
  }, [])

  const setReloads = useCallback(compute => {
    if (typeof compute === 'function') {
      reloads.current = compute(reloads.current)
    } else {
      reloads.current = compute
    }
  }, [])

  const addCachedData = useCallback(
    (key, newData) => {
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
    (key, method) => {
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
    key => {
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
    key => {
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

  const reload = useCallback(async key => {
    if (key && typeof key === 'string') {
      await (reloads.current[key] && reloads.current[key]())
    }
  }, [])

  const reloadAll = useCallback(async () => {
    await Promise.all(
      Object.values(reloads.current).map(reloadFn => reloadFn()),
    )
  }, [])

  const getCachedData = useCallback(key => {
    if (key) {
      return cachedData.current[key] || undefined
    }

    return cachedData.current
  }, [])

  const getReloads = useCallback(key => {
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

export const useDataLoaderContext = () => useContext(DataLoaderContext)

export default DataLoaderProvider
