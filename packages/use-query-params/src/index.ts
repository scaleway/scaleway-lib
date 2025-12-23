import type { ParsedQuery } from 'query-string'
import queryString from 'query-string'
import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type ParsedQueryDefault = ParsedQuery<string | boolean | number | undefined>

type SetQueryParams = <T extends ParsedQueryDefault>(
  nextParams: Partial<T>,
  options?: Options,
) => void

type ReplaceQueryParams = <T extends ParsedQueryDefault>(
  newParams: T,
  options?: Options,
) => void

type UseQueryParamsResult<T extends ParsedQueryDefault> = {
  queryParams: T
  /**
   * Replace the query params in the url. It erases all current values and sets the new ones.
   *
   * @param newParams - The values to set in the query string, overwriting existing ones
   * @param options - Options to define behavior
   */
  replaceQueryParams: ReplaceQueryParams
  /**
   * Set query params in the url. It merges the existing values with the new ones.
   *
   * @param nextParams - The values to add or update in the existing query string
   * @param options - Options to define behavior
   */
  setQueryParams: SetQueryParams
}

type Options = {
  /** Set to true to push a new entry onto the history stack */
  push: boolean
}

// === Hook ===
const useQueryParams = <
  T extends ParsedQueryDefault,
>(): UseQueryParamsResult<T> => {
  const navigate = useNavigate()
  const location = useLocation()

  const currentState = useMemo(
    () =>
      queryString.parse(location.search, {
        arrayFormat: 'comma',
        parseBooleans: true,
        parseNumbers: true,
      }) as unknown as T,
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
        navigate(`${location.pathname}?${stringifiedParams}`, {
          replace: !options?.push,
        })
      }
    },
    [navigate, location.pathname, location.search, stringyFormat],
  )

  const setQueryParams = useCallback<SetQueryParams>(
    (nextParams, options) => {
      replaceInUrlIfNeeded({ ...currentState, ...nextParams }, options)
    },
    [currentState, replaceInUrlIfNeeded],
  )

  const replaceQueryParams = useCallback<ReplaceQueryParams>(
    (nextParams, options) => {
      replaceInUrlIfNeeded(nextParams as unknown as T, options)
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
// export type { parse as parseQueryParams, stringify as stringifyQueryParams }
