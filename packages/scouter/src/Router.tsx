import type { History } from 'history'
import type { PropsWithChildren } from 'react'
import { useLayoutEffect, useMemo, useState } from 'react'
import { HistoryContext } from './useHistory'
import { LocationContext } from './useLocation'
import type { RouteContextValue } from './useRouteContext'
import { RouteContext } from './useRouteContext'

export const Router = ({ history, children }: PropsWithChildren<{ history: History }>) => {
  const rootRouteValue = useMemo(
    (): RouteContextValue => ({
      match: { params: {}, isExact: false },
    }),
    [],
  )

  const [location, setLocation] = useState(() => history.location)

  useLayoutEffect(() => {
    const unlisten = history.listen(() => {
      setLocation(history.location)
    })
    // Sync in case a navigation happened before the listener was registered
    // (e.g., a <Redirect> firing in a child's useLayoutEffect during mount).
    setLocation(history.location)
    return unlisten
  }, [history])

  return (
    <HistoryContext.Provider value={history}>
      <LocationContext.Provider value={location}>
        <RouteContext.Provider value={rootRouteValue}>{children}</RouteContext.Provider>
      </LocationContext.Provider>
    </HistoryContext.Provider>
  )
}
