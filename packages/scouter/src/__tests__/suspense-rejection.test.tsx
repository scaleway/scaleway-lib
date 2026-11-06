// Tests covering how the router behaves when a Suspense promise rejects, and
// how it recovers (error boundaries, redirects, navigation) around suspended
// routes.

// oxlint-disable import/no-unassigned-import typescript/only-throw-error

// https://github.com/testing-library/jest-dom/issues/515
import '@testing-library/jest-dom/vitest'
import { act, render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Component, Suspense } from 'react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Redirect, Route, Switch } from '../index'
import { Router } from '../Router'
import type { Deferred } from './utils/suspense'
import { createDeferred, isResolved } from './utils/suspense'
import { Suspender } from './utils/suspenseComponents'

type BoundaryProps = { onError: (error: unknown) => void; children: ReactNode }

const errorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return JSON.stringify(error)
}

class ErrorBoundary extends Component<BoundaryProps, { error: unknown }> {
  public constructor(props: BoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  public static getDerivedStateFromError(error: unknown) {
    return { error }
  }

  public override componentDidCatch(error: unknown) {
    this.props.onError(error)
  }

  // React's class render() returning JSX is a false positive for this rule.
  // oxlint-disable-next-line typescript/promise-function-async
  public override render() {
    if (this.state.error !== null) {
      return <div>Error boundary caught: {errorMessage(this.state.error)}</div>
    }
    return this.props.children
  }
}

// Simulates checking an auth session, then redirecting based on the result.
const RequireAuth = ({ deferred }: { deferred: Deferred }) => {
  const status = isResolved(deferred)

  if (status === 'pending') {
    throw deferred.promise
  }

  return <Redirect to="/dashboard" from="/login" />
}

describe('scouter with a rejecting Suspense promise', () => {
  beforeEach(() => {
    // React logs a caught suspense-rejection error to console.error; silence
    // it so the test output stays clean (the error is asserted via the boundary).
    vi.spyOn(console, 'error').mockReturnValue(undefined)
  })

  it('rejecting a suspended route surfaces the error to an error boundary', async () => {
    const deferred = createDeferred<string>()
    const onError = vi.fn<(error: unknown) => void>()

    render(
      <MemoryRouter initialEntries={['/broken']}>
        <ErrorBoundary onError={onError}>
          <Route path="/broken">
            <Suspense fallback={<div>loading</div>}>
              <Suspender deferred={deferred} name="broken" />
            </Suspense>
          </Route>
        </ErrorBoundary>
      </MemoryRouter>,
    )

    expect(screen.getByText('loading')).toBeInTheDocument()

    await act(async () => {
      await Promise.resolve()
      deferred.reject(new Error('boom'))
    })

    expect(onError).toHaveBeenCalledWith(expect.any(Error))
    expect(screen.getByText(/Error boundary caught: boom/v)).toBeInTheDocument()
  })

  it('the router keeps working after a suspended route rejects', async () => {
    const deferred = createDeferred<string>()
    const history = createMemoryHistory({ initialEntries: ['/broken'] })
    const onError = vi.fn<(error: unknown) => void>()

    render(
      <Router history={history}>
        <Switch>
          <Route path="/broken">
            <ErrorBoundary onError={onError}>
              <Suspense fallback={<div>loading</div>}>
                <Suspender deferred={deferred} name="broken" />
              </Suspense>
            </ErrorBoundary>
          </Route>
          <Route path="/ok" render={() => <div>ok content</div>} />
        </Switch>
      </Router>,
    )

    expect(screen.getByText('loading')).toBeInTheDocument()

    await act(async () => {
      await Promise.resolve()
      deferred.reject(new Error('boom'))
    })

    expect(onError).toHaveBeenCalledWith(expect.any(Error))
    expect(screen.getByText(/Error boundary caught: boom/v)).toBeInTheDocument()

    act(() => {
      history.push('/ok')
    })

    expect(screen.getByText('ok content')).toBeInTheDocument()
    expect(history.location.pathname).toBe('/ok')
  })

  it('rejecting a promise of a route you navigated away from is ignored', async () => {
    const deferred = createDeferred<string>()
    const history = createMemoryHistory({ initialEntries: ['/broken'] })
    const onError = vi.fn<(error: unknown) => void>()

    render(
      <Router history={history}>
        <Switch>
          <Route path="/broken">
            <ErrorBoundary onError={onError}>
              <Suspense fallback={<div>loading</div>}>
                <Suspender deferred={deferred} name="broken" />
              </Suspense>
            </ErrorBoundary>
          </Route>
          <Route path="/fast" render={() => <div>fast content</div>} />
        </Switch>
      </Router>,
    )

    expect(screen.getByText('loading')).toBeInTheDocument()

    act(() => {
      history.push('/fast')
    })

    expect(screen.getByText('fast content')).toBeInTheDocument()

    // Rejecting the old route's promise after it was unmounted must not
    // surface the error anywhere or break the router.
    await act(async () => {
      await Promise.resolve()
      deferred.reject(new Error('too late'))
    })

    expect(onError).not.toHaveBeenCalled()
    expect(screen.getByText('fast content')).toBeInTheDocument()
    expect(history.location.pathname).toBe('/fast')
  })

  it('navigating to a new suspending route after a rejection still works', async () => {
    const brokenDeferred = createDeferred<string>()
    const nextDeferred = createDeferred<string>()
    const history = createMemoryHistory({ initialEntries: ['/broken'] })
    const onError = vi.fn<(error: unknown) => void>()

    render(
      <Router history={history}>
        <Switch>
          <Route path="/broken">
            <ErrorBoundary onError={onError}>
              <Suspense fallback={<div>broken loading</div>}>
                <Suspender deferred={brokenDeferred} name="broken" />
              </Suspense>
            </ErrorBoundary>
          </Route>
          <Route path="/next">
            <Suspense fallback={<div>next loading</div>}>
              <Suspender deferred={nextDeferred} name="next" />
            </Suspense>
          </Route>
        </Switch>
      </Router>,
    )

    await act(async () => {
      await Promise.resolve()
      brokenDeferred.reject(new Error('boom'))
    })

    expect(screen.getByText(/Error boundary caught: boom/v)).toBeInTheDocument()

    // Navigate to another suspending route and resolve it as expected.
    act(() => {
      history.replace('/next')
    })

    expect(screen.getByText('next loading')).toBeInTheDocument()

    await act(async () => {
      await Promise.resolve()
      nextDeferred.resolve('ok')
    })

    expect(screen.getByText('next loaded: ok')).toBeInTheDocument()
    expect(history.location.pathname).toBe('/next')
  })
})

describe('scouter with redirects around Suspense', () => {
  it('redirecting while a route is suspended lands on the target once resolved', async () => {
    const deferred = createDeferred<string>()
    const history = createMemoryHistory({ initialEntries: ['/old'] })

    render(
      <Router history={history}>
        <Switch>
          <Route path="/old">
            <Suspense fallback={<div>old loading</div>}>
              <Suspender deferred={deferred} name="old" />
            </Suspense>
          </Route>
          <Route path="/target" render={() => <div>target content</div>} />
        </Switch>
      </Router>,
    )

    expect(screen.getByText('old loading')).toBeInTheDocument()

    // A redirect (or any imperative navigation) while the route is suspended.
    act(() => {
      history.replace('/target')
    })

    expect(screen.getByText('target content')).toBeInTheDocument()
    expect(history.location.pathname).toBe('/target')

    // Late resolution of the suspended route must not bring it back.
    await act(async () => {
      await Promise.resolve()
      deferred.resolve('late')
    })

    expect(screen.queryByText(/old loaded/v)).not.toBeInTheDocument()
    expect(screen.getByText('target content')).toBeInTheDocument()
  })

  it('redirecting right after a suspense retry reaches the target', async () => {
    const deferred = createDeferred<string>()
    const history = createMemoryHistory({ initialEntries: ['/login'] })

    render(
      <Router history={history}>
        <Switch>
          <Route path="/login">
            <Suspense fallback={<div>checking auth</div>}>
              <RequireAuth deferred={deferred} />
            </Suspense>
          </Route>
          <Route path="/dashboard" render={() => <div>dashboard content</div>} />
        </Switch>
      </Router>,
    )

    expect(screen.getByText('checking auth')).toBeInTheDocument()

    await act(async () => {
      await Promise.resolve()
      deferred.resolve('authed')
    })

    expect(history.location.pathname).toBe('/dashboard')
    expect(screen.getByText('dashboard content')).toBeInTheDocument()
  })
})
