import type { History } from 'history'
import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import { HistoryContext } from './useHistory'
import type { RouteContextValue } from './useRouteContext'
import { RouteContext } from './useRouteContext'

export const Router = ({ history, children }: PropsWithChildren<{ history: History }>) => {
  const rootRouteValue = useMemo(
    (): RouteContextValue => ({
      match: { params: {}, isExact: false },
    }),
    [],
  )

  return (
    <HistoryContext.Provider value={history}>
      <RouteContext.Provider value={rootRouteValue}>{children}</RouteContext.Provider>
    </HistoryContext.Provider>
  )
}
