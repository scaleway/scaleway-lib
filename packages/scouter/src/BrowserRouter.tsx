import { createBrowserHistory } from 'history'
import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import { Router } from './Router'

export const BrowserRouter = (props: PropsWithChildren) => {
  const { children } = props
  const [history] = useState(() => createBrowserHistory())

  return <Router history={history}>{children}</Router>
}
