import { parse, stringify } from 'query-string'
import { useHistory, useLocation } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

const useQueryParams = () => {
  const { replace } = useHistory()
  const location = useLocation()

  const currentState = useMemo(
    () =>
      parse(location.search, {
        arrayFormat: 'comma',
        parseBooleans: true,
        parseNumbers: true,
      }),
    [location.search],
  )

  const stringyFormat = useCallback(
    params =>
      stringify(params, {
        arrayFormat: 'comma',
        skipEmptyString: true,
        skipNull: true,
        sort: (a, b) => a.localeCompare(b),
      }),
    [],
  )

  const replaceInUrlIfNeeded = useCallback(
    newState => {
      const stringifiedParams = stringyFormat(newState)
      const searchToCompare = location.search || '?'

      if (searchToCompare !== `?${stringifiedParams}`) {
        replace(`${location.pathname}?${stringifiedParams}`)
      }
    },
    [replace, location.pathname, location.search, stringyFormat],
  )

  /**
   * Set query params in the url. It merge the existing values with the new ones.
   * @param {Object} nextParams The params to set in the url as query params
   */
  const setQueryParams = useCallback(
    nextParams => {
      replaceInUrlIfNeeded({ ...currentState, ...nextParams })
    },
    [currentState, replaceInUrlIfNeeded],
  )

  /**
   * Replace the query params in the url. It erase all current values and put the new ones
   * @param {Object} newParams
   */
  const replaceQueryParams = useCallback(
    newParams => {
      replaceInUrlIfNeeded({ ...newParams })
    },
    [replaceInUrlIfNeeded],
  )

  return {
    queryParams: currentState,
    replaceQueryParams,
    setQueryParams,
  }
}
export default useQueryParams
