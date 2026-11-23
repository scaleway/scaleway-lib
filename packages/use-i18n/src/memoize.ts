// The JSON of the whole argument list is the cache key: option objects are
// recreated at every call site, so only their content can key the cache.
export const memoize = <Args extends unknown[], Value>(fn: (...args: Args) => Value) => {
  const store = new Map<string, Value>()

  return (...args: Args): Value => {
    const key = JSON.stringify(args)
    const cached = store.get(key)
    if (cached !== undefined) {
      return cached
    }

    const value = fn(...args)
    store.set(key, value)
    return value
  }
}
