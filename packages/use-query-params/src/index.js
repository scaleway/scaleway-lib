import { parse, stringify } from 'query-string'
import { useCallback, useEffect, useState } from 'react'

const parseFormat = search =>
  parse(search, {
    parseNumbers: true,
    parseBooleans: true,
    arrayFormat: 'comma',
  })

const stringyFormat = params =>
  stringify(params, {
    arrayFormat: 'comma',
    sort: (a, b) => a.localeCompare(b),
  })

const useQueryParams = () => {
  const { search, pathname } = window.location

  const [state, setState] = useState(parseFormat(search))

  const setQueryParams = nextParams => {
    setState(prevState => ({ ...prevState, ...nextParams }))
  }

  useEffect(() => {
    const stringifiedParams = stringyFormat(state)
    window.history.replaceState(
      window.history.state,
      null,
      `${pathname}?${stringifiedParams}`,
    )
  }, [pathname, state])

  return {
    queryParams: state,
    setQueryParams,
  }
}

export default useQueryParams
