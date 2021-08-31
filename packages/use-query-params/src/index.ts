import { History } from 'history'
import { ParsedQuery, parse, stringify } from 'query-string'
import { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

interface Options {
  /** Set to true to push a new entry onto the history stack */
  push: boolean
}

const useQueryParams = (): {
  queryParams: ParsedQuery<string | number | boolean>;
  /**
   * Replace the query params in the url. It erase all current values and put the new ones
   *
   * @param newParams - The values to set in the query string, overweriting existing one
   * @param options - Options to define behavior
   */
  replaceQueryParams: typeof replaceQueryParams
  /**
   * Set query params in the url. It merge the existing values with the new ones.
   *
   * @param nextParams - The values to add or update in the existing query string
   * @param options - Options to define behavior
   */
  setQueryParams: typeof setQueryParams
} => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { replace, push } = useHistory<History>()
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
    (newState: Record<string,unknown>, options?: Options) => {
      const stringifiedParams = stringyFormat(newState)
      const searchToCompare = location.search || '?'

      if (searchToCompare !== `?${stringifiedParams}`) {
        const fn = options?.push ? push : replace
        fn(`${location.pathname}?${stringifiedParams}`)
      }
    },
    [push, replace, location.pathname, location.search, stringyFormat],
  )

  const setQueryParams = useCallback(
    (nextParams: Record<string,unknown>, options?: Options): void => {
      replaceInUrlIfNeeded({ ...currentState, ...nextParams }, options)
    },
    [currentState, replaceInUrlIfNeeded],
  )

  const replaceQueryParams = useCallback(
    (newParams: Record<string,unknown>, options?: Options): void => {
      replaceInUrlIfNeeded(newParams, options)
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
