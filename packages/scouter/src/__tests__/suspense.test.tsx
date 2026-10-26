// Tests covering how the router behaves when React Suspense is involved:
// suspending route components, retries, and navigating while suspended.

// require-unicode-regexp's `v` flag breaks the browser locator selector engine
// oxlint-disable require-unicode-regexp

import { createMemoryHistory } from 'history'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { z } from 'zod'
import { MemoryRouter, Route, Switch } from '../index'
import { Router } from '../Router'
import { act } from './utils/reactAct'
import { createDeferred } from './utils/suspense'
import {
  LocationSuspender,
  ParamsSuspender,
  QueryParamsSuspender,
  SharedList,
  StatefulSuspender,
  Suspender,
} from './utils/suspenseComponents'

describe('scouter with React Suspense', () => {
  it('suspends a route, then renders it once the promise resolves', async () => {
    const deferred = createDeferred<string>()

    const screen = await render(
      <MemoryRouter initialEntries={['/slow']}>
        <Route path="/slow">
          <Suspense fallback={<div>loading</div>}>
            <Suspender deferred={deferred} name="slow" />
          </Suspense>
        </Route>
      </MemoryRouter>,
    )

    expect(screen.getByText('loading').element()).toBeDefined()
    expect(screen.getByText(/slow loaded/).query()).toBeNull()

    await act(async () => {
      await Promise.resolve()
      deferred.resolve('42')
    })

    expect(screen.getByText('slow loaded: 42').element()).toBeDefined()
    expect(screen.getByText('loading').query()).toBeNull()
  })

  it('suspended component reads router context (params, location) once retried', async () => {
    const deferred = createDeferred<string>()

    const screen = await render(
      <MemoryRouter initialEntries={['/users/42']}>
        <Route path="/users/:id">
          <Suspense fallback={<div>loading</div>}>
            <ParamsSuspender deferred={deferred} />
          </Suspense>
        </Route>
      </MemoryRouter>,
    )

    expect(screen.getByText('loading').element()).toBeDefined()

    await act(async () => {
      await Promise.resolve()
      deferred.resolve('ok')
    })

    expect(screen.getByText('params:{"id":"42"} location:/users/42 value:ok').element()).toBeDefined()
  })

  it('a suspending route inside a Switch only shows its own fallback', async () => {
    const deferred = createDeferred<string>()

    const screen = await render(
      <MemoryRouter initialEntries={['/slow']}>
        <Switch>
          <Route path="/slow">
            <Suspense fallback={<div>slow loading</div>}>
              <Suspender deferred={deferred} name="slow" />
            </Suspense>
          </Route>
          <Route path="/fast" render={() => <div>fast content</div>} />
        </Switch>
      </MemoryRouter>,
    )

    expect(screen.getByText('slow loading').element()).toBeDefined()

    await act(async () => {
      await Promise.resolve()
      deferred.resolve('ok')
    })

    expect(screen.getByText('slow loaded: ok').element()).toBeDefined()
  })

  it('navigating away while a route is suspended does not resurrect the old route', async () => {
    const slowDeferred = createDeferred<string>()
    const history = createMemoryHistory({ initialEntries: ['/slow'] })

    const screen = await render(
      <Router history={history}>
        <Switch>
          <Route path="/slow">
            <Suspense fallback={<div>slow loading</div>}>
              <Suspender deferred={slowDeferred} name="slow" />
            </Suspense>
          </Route>
          <Route path="/fast" render={() => <div>fast content</div>} />
        </Switch>
      </Router>,
    )

    expect(screen.getByText('slow loading').element()).toBeDefined()

    // Navigate away while slow is still suspended.
    await act(() => {
      history.push('/fast')
    })

    expect(screen.getByText('fast content').element()).toBeDefined()

    // The old promise resolving afterwards must not resurrect the old route.
    await act(async () => {
      await Promise.resolve()
      slowDeferred.resolve('late')
    })

    expect(screen.getByText(/slow loaded/).query()).toBeNull()
    expect(screen.getByText('fast content').element()).toBeDefined()
    expect(history.location.pathname).toBe('/fast')
  })

  it('navigating between two suspending routes resolves in order', async () => {
    const slowDeferred = createDeferred<string>()
    const fastDeferred = createDeferred<string>()
    const history = createMemoryHistory({ initialEntries: ['/slow'] })

    const screen = await render(
      <Router history={history}>
        <Switch>
          <Route path="/slow">
            <Suspense fallback={<div>slow loading</div>}>
              <Suspender deferred={slowDeferred} name="slow" />
            </Suspense>
          </Route>
          <Route path="/fast">
            <Suspense fallback={<div>fast loading</div>}>
              <Suspender deferred={fastDeferred} name="fast" />
            </Suspense>
          </Route>
        </Switch>
      </Router>,
    )

    expect(screen.getByText('slow loading').element()).toBeDefined()

    await act(() => {
      history.push('/fast')
    })

    expect(screen.getByText('fast loading').element()).toBeDefined()

    // Resolve the old one first, then the current one.
    await act(async () => {
      await Promise.resolve()
      slowDeferred.resolve('late')
    })

    expect(screen.getByText('fast loading').element()).toBeDefined()

    await act(async () => {
      await Promise.resolve()
      fastDeferred.resolve('now')
    })

    expect(screen.getByText('fast loaded: now').element()).toBeDefined()
    expect(screen.getByText(/slow loaded/).query()).toBeNull()
  })

  it('a same-route param change while suspended retries with the new params', async () => {
    const deferred = createDeferred<string>()
    const history = createMemoryHistory({ initialEntries: ['/users/1'] })

    const screen = await render(
      <Router history={history}>
        <Route path="/users/:id">
          <Suspense fallback={<div>loading user</div>}>
            <ParamsSuspender deferred={deferred} />
          </Suspense>
        </Route>
      </Router>,
    )

    expect(screen.getByText('loading user').element()).toBeDefined()

    // Change the param while the same component is still suspended.
    await act(() => {
      history.push('/users/2')
    })

    expect(screen.getByText('loading user').element()).toBeDefined()

    await act(async () => {
      await Promise.resolve()
      deferred.resolve('ok')
    })

    expect(screen.getByText('params:{"id":"2"} location:/users/2 value:ok').element()).toBeDefined()
  })

  it('useSafeQueryParams reads the right query params after a suspense retry', async () => {
    const deferred = createDeferred<string>()
    const schema = z.object({ name: z.string(), age: z.string() })

    const screen = await render(
      <MemoryRouter initialEntries={['/users?name=john&age=30']}>
        <Route path="/users">
          <Suspense fallback={<div>loading</div>}>
            <QueryParamsSuspender deferred={deferred} schema={schema} />
          </Suspense>
        </Route>
      </MemoryRouter>,
    )

    expect(screen.getByText('loading').element()).toBeDefined()

    await act(async () => {
      await Promise.resolve()
      deferred.resolve('ok')
    })

    expect(screen.getByText('query:{"name":"john","age":"30"}').element()).toBeDefined()
  })

  it('useSafeQueryParams reflects a query change made while suspended', async () => {
    const deferred = createDeferred<string>()
    const schema = z.object({ name: z.string(), age: z.string() })
    const history = createMemoryHistory({ initialEntries: ['/users?name=john&age=30'] })

    const screen = await render(
      <Router history={history}>
        <Route path="/users">
          <Suspense fallback={<div>loading</div>}>
            <QueryParamsSuspender deferred={deferred} schema={schema} />
          </Suspense>
        </Route>
      </Router>,
    )

    expect(screen.getByText('loading').element()).toBeDefined()

    // Change the query params (e.g. a filter change) while still suspended.
    await act(() => {
      history.push('/users?name=jane&age=25')
    })

    expect(screen.getByText('loading').element()).toBeDefined()

    await act(async () => {
      await Promise.resolve()
      deferred.resolve('ok')
    })

    expect(screen.getByText('query:{"name":"jane","age":"25"}').element()).toBeDefined()
  })

  it('when the Suspense boundary wraps the router, a navigation during suspense is not lost', async () => {
    const deferred = createDeferred<string>()
    const history = createMemoryHistory({ initialEntries: ['/slow'] })

    const screen = await render(
      // Boundary OUTSIDE the router: while suspending, the Router never
      // mounted, so its history listener may not be registered yet.
      <Suspense fallback={<div>app loading</div>}>
        <Router history={history}>
          <Switch>
            <Route path="/slow">
              <Suspender deferred={deferred} name="slow" />
            </Route>
            <Route path="/fast" render={() => <div>fast content</div>} />
          </Switch>
        </Router>
      </Suspense>,
    )

    expect(screen.getByText('app loading').element()).toBeDefined()

    // Navigate while the router itself is suspended (no listener registered).
    await act(() => {
      history.push('/fast')
    })

    await act(async () => {
      await Promise.resolve()
      deferred.resolve('ok')
    })

    // The navigation must not be lost after the router retries.
    expect(history.location.pathname).toBe('/fast')
    expect(screen.getByText(/slow loaded/).query()).toBeNull()
    expect(screen.getByText('fast content').element()).toBeDefined()
  })

  it('navigating twice while suspended keeps the last destination', async () => {
    const slowDeferred = createDeferred<string>()
    const history = createMemoryHistory({ initialEntries: ['/slow'] })

    const screen = await render(
      <Router history={history}>
        <Switch>
          <Route path="/slow">
            <Suspense fallback={<div>slow loading</div>}>
              <Suspender deferred={slowDeferred} name="slow" />
            </Suspense>
          </Route>
          <Route path="/middle" render={() => <div>middle content</div>} />
          <Route path="/final" render={() => <div>final content</div>} />
        </Switch>
      </Router>,
    )

    expect(screen.getByText('slow loading').element()).toBeDefined()

    // Two quick navigations while the route is suspended: only the last one wins.
    await act(() => {
      history.push('/middle')
      // oxlint-disable-next-line unicorn/prefer-single-call
      history.push('/final')
    })

    expect(screen.getByText('final content').element()).toBeDefined()
    expect(screen.getByText('middle content').query()).toBeNull()
    expect(history.location.pathname).toBe('/final')

    await act(async () => {
      await Promise.resolve()
      slowDeferred.resolve('late')
    })

    expect(screen.getByText('final content').element()).toBeDefined()
    expect(screen.getByText(/slow loaded/).query()).toBeNull()
  })

  it('a same-route navigation while suspended retries with the new location', async () => {
    const deferred = createDeferred<string>()
    const history = createMemoryHistory({ initialEntries: ['/'] })

    const screen = await render(
      <Router history={history}>
        <Route path="/">
          <Suspense fallback={<div>loading</div>}>
            <LocationSuspender deferred={deferred} />
          </Suspense>
        </Route>
      </Router>,
    )

    expect(screen.getByText('loading').element()).toBeDefined()

    // Same route, only the search string changes while still suspended.
    await act(() => {
      history.push({ pathname: '/', search: '?page=2' })
    })

    await act(async () => {
      await Promise.resolve()
      deferred.resolve('ok')
    })

    expect(screen.getByText('target:?page=2').element()).toBeDefined()
  })

  it('state is preserved across a suspense retry (no remount)', async () => {
    const deferred = createDeferred<string>()
    const mountCount = vi.fn<() => void>()

    const screen = await render(
      <MemoryRouter initialEntries={['/stateful']}>
        <Route path="/stateful">
          <Suspense fallback={<div>loading</div>}>
            <StatefulSuspender deferred={deferred} onMount={mountCount} />
          </Suspense>
        </Route>
      </MemoryRouter>,
    )

    expect(screen.getByText('loading').element()).toBeDefined()

    await act(async () => {
      await Promise.resolve()
      deferred.resolve('ok')
    })

    // Mounted once during the retry, not on every throw/resolve cycle.
    expect(mountCount).toHaveBeenCalledTimes(1)
    expect(screen.getByText('state:0').element()).toBeDefined()
  })

  it('resolves multiple independent suspended routes at once', async () => {
    const first = createDeferred<string>()
    const second = createDeferred<string>()

    const screen = await render(
      <MemoryRouter initialEntries={['/page']}>
        <Route path="/page">
          <div>
            <Suspense fallback={<span>first loading</span>}>
              <Suspender deferred={first} name="first" />
            </Suspense>
            <Suspense fallback={<span>second loading</span>}>
              <Suspender deferred={second} name="second" />
            </Suspense>
          </div>
        </Route>
      </MemoryRouter>,
    )

    expect(screen.getByText('first loading').element()).toBeDefined()
    expect(screen.getByText('second loading').element()).toBeDefined()

    await act(async () => {
      await Promise.resolve()
      first.resolve('1')
      second.resolve('2')
    })

    expect(screen.getByText('first loaded: 1').element()).toBeDefined()
    expect(screen.getByText('second loaded: 2').element()).toBeDefined()
  })

  it('a shared component across routes suspends fresh on each route (no stale content)', async () => {
    const aDeferred = createDeferred<string>()
    const bDeferred = createDeferred<string>()
    const history = createMemoryHistory({ initialEntries: ['/a'] })

    const screen = await render(
      <Router history={history}>
        <Suspense fallback={<div>loading</div>}>
          <Switch>
            <Route path="/a" render={() => <SharedList deferred={aDeferred} name="A" />} />
            <Route path="/b" render={() => <SharedList deferred={bDeferred} name="B" />} />
          </Switch>
        </Suspense>
      </Router>,
    )

    expect(screen.getByText('loading').element()).toBeDefined()

    await act(async () => {
      await Promise.resolve()
      aDeferred.resolve('a data')
    })

    expect(screen.getByText('A content').element()).toBeDefined()

    // Navigate to a route that mounts the same component type. The shared
    // boundary hides the old content and shows the fallback while the new one loads.
    await act(() => {
      history.push('/b')
    })

    await expect.element(screen.getByText('A content')).not.toBeVisible()
    await expect.element(screen.getByText('loading')).toBeVisible()

    await act(async () => {
      await Promise.resolve()
      bDeferred.resolve('b data')
    })

    await expect.element(screen.getByText('B content')).toBeVisible()
    expect(screen.getByText('A content').query()).toBeNull()
  })
})
