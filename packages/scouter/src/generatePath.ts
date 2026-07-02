import type { RouteParams } from 'regexparam'
import { inject } from 'regexparam'

export function generatePath<T extends string>(route: T, values: RouteParams<T>): string {
  return inject(route, values)
}
