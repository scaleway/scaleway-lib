import { parse, stringify } from 'query-string'
import { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

const useQueryParams = () => {
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
        skipEmptyString: true,
        skipNull: true,
        sort: (a, b) => a.localeCompare(b),
      }),
    [],
  )

  const [state, setState] = useState(parseFormat())

  /**
   * Set query params in the url. It merge the existing values with the new ones.
   * @param {Object} nextParams The params to set in the url as query params
   */
  const setQueryParams = nextParams => {
    setState(prevState => ({ ...prevState, ...nextParams }))
  }

  /**
   * Replace the query params in the url. It erase all current values and put the new ones
   * @param {Object} newParams
   */
  const replaceQueryparams = newParams => {
    setState({ ...newParams })
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      const stringifiedParams = stringyFormat(state)
      const searchToCompare = search || '?'

      if (searchToCompare !== `?${stringifiedParams}`) {
        replace(`${pathname}?${stringifiedParams}`)
      }
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [pathname, replace, state, search, stringyFormat])

  return {
    queryParams: state,
    replaceQueryparams,
    setQueryParams,
  }
}

export default useQueryParams
