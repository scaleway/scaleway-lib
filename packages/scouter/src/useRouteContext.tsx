import { createContext, useContext } from 'react'
import type { MaybeMatch } from './matchPath'

export type RouteContextValue = {
  match: MaybeMatch
}

export const RouteContext = createContext<RouteContextValue | null>(null)

export function useRouteContext(): RouteContextValue {
  const ctx = useContext(RouteContext)
  if (ctx === null) {
    throw new Error(`Missing RouteContext, make sure you are inside a Router !`)
  }
  return ctx
}
