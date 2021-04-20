import PropTypes from 'prop-types'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react'

export const DataLoaderContext = createContext()

const DataLoaderProvider = ({ children }) => {
  const cachedData = useRef({})
  const reloads = useRef({})

  const setCachedData = compute => {
    if (typeof compute === 'function') {
      cachedData.current = compute(cachedData.current)
    } else {
      cachedData.current = compute
    }
  }

  const setReloads = compute => {
    if (typeof compute === 'function') {
      reloads.current = compute(reloads.current)
    } else {
      reloads.current = compute
    }
  }

  const addCachedData = useCallback((key, newData) => {
    if (key && typeof key === 'string' && newData) {
      setCachedData(actualCachedData => ({
        ...actualCachedData,
        [key]: newData,
      }))
    }
  }, [])

  const addReload = useCallback((key, method) => {
    if (key && typeof key === 'string' && method) {
      setReloads(actualReloads => ({
        ...actualReloads,
        [key]: method,
      }))
    }
  }, [])

  const clearReload = useCallback(key => {
    if (key && typeof key === 'string') {
      setReloads(actualReloads => {
        const tmp = actualReloads
        delete tmp[key]

        return tmp
      })
    } else {
      setReloads({})
    }
  }, [])

  const clearCachedData = useCallback(key => {
    if (key && typeof key === 'string') {
      setCachedData(actualCachedData => {
        const tmp = actualCachedData
        delete tmp[key]

        return tmp
      })
    } else {
      setCachedData({})
    }
  }, [])

  const reload = useCallback(
    async key => {
      if (key && typeof key === 'string') {
        await (reloads.current[key] && reloads.current[key]())
      } else {
        await Promise.all(
          Object.values(reloads.current).map(reloadFn => reloadFn()),
        )
      }
    },
    [reloads],
  )

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
      clearCachedData,
      getCachedData,
      reload,
      getReloads,
      addReload,
      clearReload,
    }),
    [
      addCachedData,
      clearReload,
      clearCachedData,
      getCachedData,
      getReloads,
      addReload,
      reload,
    ],
  )

  return (
    <DataLoaderContext.Provider value={value}>
      {children}
    </DataLoaderContext.Provider>
  )
}

DataLoaderProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useDataLoaderContext = () => useContext(DataLoaderContext)

export default DataLoaderProvider
