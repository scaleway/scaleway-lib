import type { RouteParams } from 'regexparam'
import type { CompiledRoute } from './compileRoute'
import { compileRoute } from './compileRoute'

function execCompiled(path: CompiledRoute, pathname: string): false | MatchParams {
  const matches = path.pattern.exec(pathname)
  if (!matches) {
    return false
  }
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return path.keys.reduce<Record<string, string | undefined>>((acc, key, index) => {
    const value = matches[index + 1] ?? undefined
    acc[key] = value ? decodeURI(value) : value
    return acc
  }, {}) as MatchParams
}

export type { RouteParams }

export type MatchParams = Record<string, string>

export type Match<P = MatchParams> = {
  params: P
  isExact: boolean
}

export type MaybeMatch<P = MatchParams> = Match<P> | null

export type MatchPathOptions = {
  /**
   * true = only match if exact
   * false = match both exact and loose
   */
  exact?: boolean
}

/**
 * Public API for matching a URL pathname to a path.
 */
export function matchPath<T extends string>(
  pathname: string | undefined,
  route: string | undefined,
  options: MatchPathOptions = {},
): MaybeMatch<RouteParams<T>> {
  if (!route) {
    return null
  }

  const pathCompiled = compileRoute(route)
  const { exact } = options

  if (!pathname) {
    return null
  }

  if (exact === true) {
    const res = execCompiled(pathCompiled.exact, pathname)
    if (!res) {
      return null
    }
    return {
      isExact: true,
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      params: res as RouteParams<T>,
    }
  }
  const res = execCompiled(pathCompiled.loose, pathname)
  if (!res) {
    return null
  }
  return {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    params: res as RouteParams<T>,
    isExact: pathCompiled.exact.pattern.test(pathname),
  }
}

/**
 * Return the match of the first route or null
 */
export function matchPaths(pathname: string | undefined, routes: string[], options: MatchPathOptions = {}): MaybeMatch {
  for (const route of routes) {
    const match = matchPath(pathname, route, options)
    if (match) {
      return match
    }
  }
  return null
}
