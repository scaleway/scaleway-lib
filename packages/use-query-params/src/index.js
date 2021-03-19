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

  /**
   * Set query params in the url
   * @param {Object} nextParams The params to set in the url as query params
   * @param {boolean} merge Merge current params with the new ones. If false current params will be erased. If true, same keys are merged and the new value is keep
   */
  const setQueryParams = (nextParams, merge = true) => {
    if (merge) {
      setState(prevState => ({ ...prevState, ...nextParams }))
    } else {
      setState({ ...nextParams })
    }
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
