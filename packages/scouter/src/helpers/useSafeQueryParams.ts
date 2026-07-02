import { useCallback, useMemo } from 'react'
import type { z } from 'zod'
import { useHistory } from '../useHistory'
import { useLocation } from '../useLocation'
import { getSafeQueryParams } from './getSafeQueryParams'

type SetQueryParamsOptions = {
  keepExisting?: boolean
  push?: boolean
}
const DEFAULT_SETQUERYPARAMS_OPTIONS: SetQueryParamsOptions = {
  keepExisting: true,
  push: false,
}

const safeStoreValue = ({
  searchParams,
  key,
  value,
}: {
  searchParams: URLSearchParams
  key: string
  value: unknown
}) => {
  if (value === undefined || value === null) {
    return
  }

  if (Array.isArray(value)) {
    value.forEach(elem => {
      safeStoreValue({ key, searchParams, value: elem as unknown })
    })
  }

  if (typeof value !== 'object') {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    searchParams.append(key, value as string)
  }
}

// oxlint-disable-next-line typescript-eslint/no-explicit-any
type UseSafeQueryParamsReturnType<T extends z.ZodObject<any>> = ReturnType<typeof getSafeQueryParams<T>> & {
  setQueryParams: (newParams: Partial<z.infer<T>>, options?: SetQueryParamsOptions) => void
}

// oxlint-disable-next-line typescript-eslint/no-explicit-any
export const useSafeQueryParams = <T extends z.ZodObject<any>>({
  schema,
}: {
  schema: T
}): UseSafeQueryParamsReturnType<T> => {
  const history = useHistory()
  const { search } = useLocation()

  const safeQueryParamsRes = useMemo(() => getSafeQueryParams({ schema, search }), [search, schema])

  const setQueryParams = useCallback(
    (partialData: Partial<z.infer<T>>, options: SetQueryParamsOptions = DEFAULT_SETQUERYPARAMS_OPTIONS) => {
      // Use history.location.search, to avoid re-memo this function when queryParams change,
      // it makes it easier to use this function as hook dependency
      // oxlint-disable-next-line unicorn/no-negated-condition
      const searchParams = new URLSearchParams(options.keepExisting !== false ? history.location.search : undefined)
      Object.keys(partialData).forEach(key => {
        searchParams.delete(key)
        safeStoreValue({ key, searchParams, value: partialData[key] })
      })
      history[options.push ? 'push' : 'replace']({
        search: searchParams.toString(),
      })
    },
    [history],
  )

  return {
    ...safeQueryParamsRes,
    setQueryParams,
  }
}
