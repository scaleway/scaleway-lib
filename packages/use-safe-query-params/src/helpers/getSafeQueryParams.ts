import type { z } from 'zod'
import { getQueryParamsFromSearchString } from './getQueryParamsFromSearchString'

type SafeQueryParamError = { path: string; message: string }

const EMPTY_OBJECT_STABLE_REF = {}

// oxlint-disable-next-line typescript-eslint/no-explicit-any
export const getSafeQueryParams = <T extends z.ZodObject<any>>({ search, schema }: { search: string; schema: T }) => {
  const partialSchema = schema.partial()

  const searchParamsValues = getQueryParamsFromSearchString(search)
  const zodParseRes = partialSchema.safeParse(searchParamsValues)

  if (zodParseRes.success) {
    return {
      errors: null,
      queryParams: zodParseRes.data as z.infer<ReturnType<T['partial']>>,
    }
  }

  const errors = zodParseRes.error.issues.map<SafeQueryParamError>(issue => ({
    message: issue.message,
    path: issue.path.toString(),
  }))

  // Remove key presenting errors
  const searchParamsValuesMap = new Map(Object.entries(searchParamsValues))
  errors.forEach(err => {
    searchParamsValuesMap.delete(err.path)
  })
  const searchParamsValuesWithoutErrors = Object.fromEntries(searchParamsValuesMap)

  // Parse and apply schema
  const zodParseResNewTry = partialSchema.safeParse(searchParamsValuesWithoutErrors)

  // Should always be success since we remove the errors but as safety return empty object
  return {
    errors,
    queryParams: (zodParseResNewTry.success ? zodParseResNewTry.data : EMPTY_OBJECT_STABLE_REF) as z.infer<
      ReturnType<T['partial']>
    >,
  }
}
