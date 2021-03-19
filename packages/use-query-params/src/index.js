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
        sort: (a, b) => a.localeCompare(b),
      }),
    [],
  )

  const [state, setState] = useState(parseFormat())

  const setQueryParams = nextParams => {
    setState(prevState => ({ ...prevState, ...nextParams }))
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      const stringifiedParams = stringyFormat(state)
      if (search !== `?${stringifiedParams}`)
        replace(`${pathname}?${stringifiedParams}`)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [pathname, replace, state, search, stringyFormat])

  return {
    queryParams: state,
    setQueryParams,
  }
}

export default useQueryParams
