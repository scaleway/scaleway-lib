import type { History, Location } from 'history'
import { useMemo } from 'react'
import type { Match, MaybeMatch } from './matchPath'
import { matchPaths } from './matchPath'
import { useHistory } from './useHistory'
import { useLocation } from './useLocation'
import type { RouteContextValue } from './useRouteContext'
import { RouteContext, useRouteContext } from './useRouteContext'

export type RouteRenderProps = {
  match: Match
  location: Location
  history: History
}

export type RouteInternalProps = {
  path?: string | string[]
  exact?: boolean
  computedMatch?: MaybeMatch // from Switch component
  children?: React.ReactNode
  render?: (props: RouteRenderProps) => React.ReactNode
}

export const RouteInternal = ({ path, computedMatch, exact, render, children }: RouteInternalProps) => {
  const location = useLocation()
  const history = useHistory()
  const parentRoute = useRouteContext()

  const match = useMemo(() => {
    if (computedMatch) {
      return computedMatch
    }
    if (!path) {
      return parentRoute.match
    }
    return matchPaths(location.pathname, typeof path === 'string' ? [path] : path, { exact })
  }, [computedMatch, path, location.pathname, exact, parentRoute.match])

  const ctxValue = useMemo((): RouteContextValue => ({ match }), [match])

  return (
    <RouteContext.Provider value={ctxValue}>
      {(() => {
        if (!match) {
          return null
        }
        if (children) {
          return children
        }
        if (render) {
          return render({ match, location, history })
        }
        return null
      })()}
    </RouteContext.Provider>
  )
}

export type RouteProps = Omit<RouteInternalProps, 'computedMatch'>

// oxlint-disable-next-line react/no-multi-comp
export const Route = (props: RouteProps) => <RouteInternal {...props} />
