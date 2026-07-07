import queryString from 'query-string'
import { useCallback, useMemo } from 'react'
import { useHistory } from '../useHistory'
import { useLocation } from '../useLocation'

type Options = {
  /** Set to true to push a new entry onto the history stack */
  push: boolean
}

type QueryParamValue = string | number | boolean | null | undefined

type QueryParams = {
  [key: string]: QueryParamValue | QueryParamValue[]
}

/**
 * @deprecated use useSafeQueryParams instead
 * @returns
 */
export const useQueryParams = <T extends QueryParams>(): {
  queryParams: T
  /**
   * Replace the query params in the url. It erase all current values and put the new ones
   *
   * @param newParams - The values to set in the query string, overwriting existing one
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
  // oxlint-disable-next-line typescript/unbound-method
  const { replace, push } = useHistory()
  const location = useLocation()

  const currentState = useMemo(
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    () => queryString.parse(location.search, { arrayFormat: 'comma', parseBooleans: true, parseNumbers: true }) as T,
    [location.search],
  )

  const stringyFormat = useCallback(
    (params: Partial<T>): string =>
      queryString.stringify(params, {
        arrayFormat: 'comma',
        skipEmptyString: true,
        skipNull: true,
        sort: (a, b) => a.localeCompare(b),
      }),
    [],
  )

  const replaceInUrlIfNeeded = useCallback(
    (newState: T, options?: Options) => {
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
    (nextParams: Partial<T>, options?: Options): void => {
      replaceInUrlIfNeeded({ ...currentState, ...nextParams }, options)
    },
    [currentState, replaceInUrlIfNeeded],
  )

  const replaceQueryParams = useCallback(
    (newParams: T, options?: Options): void => {
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
