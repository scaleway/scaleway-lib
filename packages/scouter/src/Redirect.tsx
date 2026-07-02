import type { To } from 'history'
import { useLayoutEffect, useMemo } from 'react'
import type { MaybeMatch } from './matchPath'
import { matchPaths } from './matchPath'
import { useHistory } from './useHistory'
import { useLocation } from './useLocation'
import { useRouteContext } from './useRouteContext'

export type RedirectInternalProps = {
  from?: string | string[]
  exact?: true | undefined
  computedMatch?: MaybeMatch // from Switch component
  push?: boolean
  to: To
}

export const RedirectInternal = ({ from: path, computedMatch, exact, push, to }: RedirectInternalProps) => {
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

  useLayoutEffect(() => {
    if (!match) {
      return
    }
    if (push) {
      history.push(to)
    } else {
      history.replace(to)
    }
  }, [match, history, to, push])

  return null
}

export type RedirectProps = Omit<RedirectInternalProps, 'computedMatch'>

// oxlint-disable-next-line react/no-multi-comp
export const Redirect = (props: RedirectProps) => <RedirectInternal {...props} />
