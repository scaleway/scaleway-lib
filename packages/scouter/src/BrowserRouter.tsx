import { BrowserHistory, createBrowserHistory } from 'history'
import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import { Router } from './Router'

export const BrowserRouter = (props: PropsWithChildren<{ history?: BrowserHistory }>) => {
  const { children, history: historyProps } = props
  const [history] = useState(() => historyProps ?? createBrowserHistory())

  return <Router history={history}>{children}</Router>
}
