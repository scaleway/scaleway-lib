import { History } from 'history'
import { ParsedQuery, parse, stringify } from 'query-string'
import { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

const useQueryParams = (): {
  queryParams: ParsedQuery<string | number | boolean>;
  replaceQueryParams: (newParams: Record<string, unknown>) => void;
  setQueryParams: (nextParams: Record<string, unknown>) => void;
} => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { replace } = useHistory<History>()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const location = useLocation<History>()

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
    (params): string =>
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
    (nextParams: Record<string,unknown>): void => {
      replaceInUrlIfNeeded({ ...currentState, ...nextParams })
    },
    [currentState, replaceInUrlIfNeeded],
  )

  /**
   * Replace the query params in the url. It erase all current values and put the new ones
   * @param {Object} newParams
   */
  const replaceQueryParams = useCallback(
    (newParams: Record<string,unknown>): void => {
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
