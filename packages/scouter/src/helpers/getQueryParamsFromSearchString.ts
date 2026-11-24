export const getQueryParamsFromSearchString = (
  search: string,
  { treatKeysAsArray = [] }: { treatKeysAsArray?: string[] } = {},
) => {
  const searchParams = new URLSearchParams(search)

  // use `.entries()` wont work since it's only get first item which cause issue with array system
  return [...searchParams.keys()].reduce<Record<string, string | string[] | undefined>>((record, key) => {
    const allValues = searchParams.getAll(key)
    const shouldBeArray = allValues.length > 1 || treatKeysAsArray.includes(key)

    record[key] = shouldBeArray ? allValues : allValues[0]

    return record
  }, {})
}
