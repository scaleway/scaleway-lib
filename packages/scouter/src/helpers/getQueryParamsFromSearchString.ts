export const getQueryParamsFromSearchString = (search: string) => {
  const searchParams = new URLSearchParams(search)

  // use `.entries()` wont work since it's only get first item which cause issue with array system
  return [...searchParams.keys()].reduce<Record<string, string | string[] | undefined>>((record, key) => {
    const allValues = searchParams.getAll(key)

    record[key] = allValues.length > 1 ? allValues : allValues[0]

    return record
  }, {})
}
