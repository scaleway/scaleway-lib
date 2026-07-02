import type { MemoryHistoryOptions } from 'history'
import { createMemoryHistory } from 'history'
import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import { Router } from './Router'

export const MemoryRouter = (props: PropsWithChildren<MemoryHistoryOptions>) => {
  const { initialEntries, initialIndex, children } = props
  const [history] = useState(() => createMemoryHistory({ initialEntries, initialIndex }))

  return <Router history={history}>{children}</Router>
}
