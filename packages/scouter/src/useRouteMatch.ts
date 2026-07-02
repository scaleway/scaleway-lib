import { useMemo } from 'react'
import type { MatchPathOptions } from './matchPath'
import { matchPath } from './matchPath'
import { useLocation } from './useLocation'

export function useRouteMatch(path: string | undefined, options?: MatchPathOptions): boolean {
  const location = useLocation()
  return useMemo(
    () => (path === undefined ? false : matchPath(location.pathname, path, options) !== null),
    [path, location.pathname, options],
  )
}
