export const getQueryParamsFromSearchString = (search: string) => {
  const searchParams = new URLSearchParams(search)

  // use `.entries()` wont work since it's only get first item which cause issue with array system
  // oxlint-disable-next-line typescript-eslint/no-explicit-any
  return [...searchParams.keys()].reduce<Record<string, any>>((record, key) => {
    const allValues = searchParams.getAll(key)

    return {
      ...record,
      [key]: allValues.length > 1 ? allValues : allValues[0],
    }
  }, {})
}
