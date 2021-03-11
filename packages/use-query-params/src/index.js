import { parse, stringify } from 'query-string'
import { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

const useQueryParams = (options = {}) => {
  const { updater = {} } = options
  const {
    location: { search, pathname },
    replace,
  } = useHistory()

  const parseFormat = useCallback(
    () =>
      parse(search, {
        parseNumbers: true,
        parseBooleans: true,
        arrayFormat: 'comma',
      }),
    [search],
  )

  const stringyFormat = useCallback(
    params =>
      stringify(params, {
        arrayFormat: 'comma',
        sort: (a, b) => a.localeCompare(b),
      }),
    [],
  )

  const defaultFnUpdater = useCallback(
    (currentQueryParams, nextQueryParams) => ({
      ...currentQueryParams,
      ...nextQueryParams,
    }),
    [],
  )
  const [state, setState] = useState(parseFormat())

  const setQueryParams = useCallback(
    nextParams => {
      const currentQueryParams = parseFormat()
      const params =
        updater instanceof Function
          ? updater(currentQueryParams, nextParams)
          : defaultFnUpdater(currentQueryParams, nextParams)

      setState(params)
    },
    [parseFormat, updater, defaultFnUpdater],
  )

  useEffect(() => {
    const stringifiedParams = stringyFormat(state)
    if (stringifiedParams !== search.replace('?', '')) {
      replace(`${pathname}?${stringifiedParams}`)
    }
  }, [pathname, replace, search, state, stringyFormat])


  return {
    queryParams: state,
    setQueryParams,
  }
}

export default useQueryParams
