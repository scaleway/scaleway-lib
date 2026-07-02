import type { RouteParams } from 'regexparam'
import { generatePath } from '../generatePath'

export type QueryParamsBase = null | Record<string, string | string[] | undefined>

type LinkArgs<RoutePath extends string, QueryParams extends QueryParamsBase> = LinkParamsTuple<
  RouteParams<RoutePath>,
  QueryParams
>

type NilIfEmpty<T> = keyof T extends never ? null | undefined : T

type LinkParamsTuple<Params, QueryParams> = QueryParams extends null
  ? object extends Params
    ? [params?: NilIfEmpty<Params>, queryParams?: null, hash?: string]
    : [params: Params, queryParams?: null, hash?: string]
  : object extends Params
    ? [params?: NilIfEmpty<Params>, queryParams?: QueryParams, hash?: string]
    : [params: Params, queryParams?: QueryParams, hash?: string]

export type RouteObj<Path extends string, QueryParams extends QueryParamsBase> = {
  withQueryParams<NewQueryParams extends QueryParamsBase>(): RouteObj<Path, NewQueryParams>

  readonly path: Path

  link(...args: LinkArgs<Path & string, QueryParams>): string
}

export type RouteObjAny = {
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
): RouteObj<Path, QueryParams> {
  const route: RouteObj<Path, QueryParams> = {
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
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion, typescript/no-explicit-any typescript/no-unsafe-return
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
): RouteObj<Path, QueryParams> {
  return createRouteInternal<Path, QueryParams>(routePath)
}

export function isRoute(maybeRoute: unknown): maybeRoute is RouteObjAny {
  return (
    typeof maybeRoute === 'object' &&
    maybeRoute !== null &&
    'path' in maybeRoute &&
    'link' in maybeRoute &&
    typeof maybeRoute.path === 'string' &&
    typeof maybeRoute.link === 'function'
  )
}
