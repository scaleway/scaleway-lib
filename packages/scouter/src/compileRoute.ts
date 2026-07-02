import { parse } from 'regexparam'

export type CompiledRoute = { keys: string[]; pattern: RegExp }

type CacheItem = { exact: CompiledRoute; loose: CompiledRoute }

const cache: Record<string, CacheItem> = {}
const cacheLimit = 10_000
let cacheCount = 0

export function compileRoute(path: string): CacheItem {
  if (cache[path]) {
    return cache[path]
  }

  const result: CacheItem = {
    exact: parse(path, false),
    loose: parse(path, true),
  }

  if (cacheCount < cacheLimit) {
    cache[path] = result
    cacheCount += 1
  }

  return result
}
