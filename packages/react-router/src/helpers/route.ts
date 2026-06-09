import { generatePath } from 'react-router-dom'
import type { ExtractRouteParams } from './types'

export type QueryParamsBase = null | Record<string, string | string[] | undefined>

type LinkArgs<RoutePath extends string, QueryParams extends QueryParamsBase> = LinkParamsTuple<
  ExtractRouteParams<RoutePath>,
  QueryParams
>

type NilIfEmpty<T> = object extends T ? (T extends object ? null | undefined : T) : T

type LinkParamsTuple<RouteParams, QueryParams> = QueryParams extends null
  ? object extends RouteParams
    ? [params?: NilIfEmpty<RouteParams>, queryParams?: null, hash?: string]
    : [params: RouteParams, queryParams?: null, hash?: string]
  : object extends RouteParams
    ? [params?: NilIfEmpty<RouteParams>, queryParams?: QueryParams, hash?: string]
    : [params: RouteParams, queryParams?: QueryParams, hash?: string]

export type Route<Path extends string, QueryParams extends QueryParamsBase> = {
  withQueryParams<NewQueryParams extends QueryParamsBase>(): Route<Path, NewQueryParams>

  readonly path: Path

  link(...args: LinkArgs<Path & string, QueryParams>): string
}

export type RouteAny = {
  path: string
  // oxlint-disable-next-line typescript/no-explicit-any
  link: (...args: any[]) => string
}

/**
 * Build a query string that supports array values (e.g., ?status=a&status=b)
 */
export function buildQueryString(params: string | Record<string, string | string[] | undefined>): string {
  if (typeof params === 'string') {
    return new URLSearchParams(params).toString()
  }
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => {
        searchParams.append(key, v)
      })
    } else if (value !== null && value !== undefined) {
      searchParams.append(key, value)
    }
  })
  return searchParams.toString()
}

function createRouteInternal<Path extends string, QueryParams extends QueryParamsBase = null>(
  routePath: Path,
): Route<Path, QueryParams> {
  const route: Route<Path, QueryParams> = {
    link(...args: LinkArgs<Path & string, QueryParams>): string {
      const [params, queryParams, hash] = args
      // generatePath can fail if params are empty,
      // in such case we don't want to crash the page so we return an empty link and send the error to sentry
      try {
        const path = generatePath(routePath as string, params ?? {})
        const qs = queryParams ? buildQueryString(queryParams) : ''
        const query = qs ? `?${qs}` : ''
        const fragment = hash ? `#${hash}` : ''
        return path + query + fragment
      } catch (error) {
        // oxlint-disable-next-line no-console
        console.error(`Failed to generate link for path ${routePath}`, error)
        return '#'
      }
    },
    path: routePath,
    withQueryParams() {
      // oxlint-disable-next-line typescript/no-explicit-any, no-unsafe-return
      return route as any
    },
  }

  return route
}

/**
 * @param routePath
 * @returns
 */
export function createRoute<Path extends string, QueryParams extends QueryParamsBase = null>(
  routePath: Path,
): Route<Path, QueryParams> {
  return createRouteInternal<Path, QueryParams>(routePath)
}

export function isRoute(maybeRoute: unknown): maybeRoute is RouteAny {
  return (
    typeof maybeRoute === 'object' &&
    maybeRoute !== null &&
    'path' in maybeRoute &&
    'link' in maybeRoute &&
    typeof maybeRoute.path === 'string' &&
    typeof maybeRoute.link === 'function'
  )
}
