// oxlint-disable vitest/require-top-level-describe typescript/no-explicit-any
import { createMemoryHistory as createHistory } from 'history'
import { useEffect, useState } from 'react'
import { describe, expect, it, test } from 'vitest'
import { render } from 'vitest-browser-react'
import { MemoryRouter, Redirect, Route, Switch, useLocation, useNavigate } from '../index'
import { Router } from '../Router'
import { act } from './utils/reactAct'

const navigateOnFirstRender = (count: number, navigate: (path: string) => void, setCount: (n: number) => void) => {
  if (count !== 0) {
    return
  }
  Promise.resolve()
    .then(() => {
      navigate('/intermediate')
      setCount(1)
      navigate('/final')
    })
    .catch(() => undefined)
}

test('renders routes correctly', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/users/123']}>
      <Route path="/users/:userId" render={({ match }) => <h1>User {match.params['userId']}</h1>} />
    </MemoryRouter>,
  )

  expect(screen.getByText('User 123').element()).toBeDefined()
})

test('updates when navigating', async () => {
  const history = createHistory({ initialEntries: ['/page1'] })

  const locations: any[] = []

  const LocationTracker = () => {
    const location = useLocation()
    locations.push(location.pathname)
    return <div>{location.pathname}</div>
  }

  await render(
    <Router history={history}>
      <Route>
        <LocationTracker />
      </Route>
    </Router>,
  )

  await act(() => {
    history.push('/page2')
  })

  expect(locations).toContain('/page1')
  expect(locations).toContain('/page2')
})

test('handles multiple redirects', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/redirect1']}>
      <Switch>
        <Redirect from="/redirect1" to="/redirect2" />
        <Redirect from="/redirect2" to="/final" />
        <Route path="/final" render={() => <h1>Final</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('Final').element()).toBeDefined()
})

describe('route with exact and strict', () => {
  it('exact matches exactly', async () => {
    const screen = await render(
      <MemoryRouter initialEntries={['/test']}>
        <Route exact path="/test" render={() => <h1>Matched</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Matched').element()).toBeDefined()
  })

  it('exact does not match with extra segments', async () => {
    const screen = await render(
      <MemoryRouter initialEntries={['/test/extra']}>
        <Route exact path="/test" render={() => <h1>Matched</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Matched').query()).toBeNull()
  })
})

test('renders all matching routes', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/test']}>
      <Route path="/test" render={() => <h1>First</h1>} />
      <Route path="/test" render={() => <h1>Second</h1>} />
    </MemoryRouter>,
  )

  expect(screen.getByText('First').element()).toBeDefined()
  expect(screen.getByText('Second').element()).toBeDefined()
})

test('location changes trigger re-renders', async () => {
  const history = createHistory({
    initialEntries: ['/initial'],
  })

  let renderCount = 0

  const Counter = () => {
    const location = useLocation()
    renderCount++
    return <div>{location.pathname}</div>
  }

  await render(
    <Router history={history}>
      <Route>
        <Counter />
      </Route>
    </Router>,
  )

  const countAfterInitial = renderCount

  await act(() => {
    history.push('/new')
  })

  expect(renderCount).toBeGreaterThan(countAfterInitial)
})

test('batches multiple navigations in a microtask (no intermediate render)', async () => {
  const history = createHistory({ initialEntries: ['/start'] })

  const seenLocations: string[] = []

  const App = () => {
    const location = useLocation()
    seenLocations.push(location.pathname)
    const navigate = useNavigate()
    const [count, setCount] = useState(0)

    useEffect(() => {
      navigateOnFirstRender(count, navigate, setCount)
    }, [count, navigate])

    return <div>{location.pathname}</div>
  }

  // async render already lets the navigation microtask run, so the initial
  // '/start' render is only observable via seenLocations below
  await render(
    <Router history={history}>
      <App />
    </Router>,
  )

  await act(async () => {
    await Promise.resolve()
  })

  // Should see '/start' (initial) and '/final' (batched), but NOT '/intermediate'
  expect(seenLocations).toContain('/start')
  expect(seenLocations).toContain('/final')
  expect(seenLocations).not.toContain('/intermediate')
})

test('does not unmount components during batched navigations', async () => {
  const history = createHistory({ initialEntries: ['/start'] })

  let unmountCount = 0

  const Sticky = () => {
    useEffect(
      () => () => {
        unmountCount++
      },
      [],
    )
    return <div>Sticky</div>
  }

  // This is a false positive it use Sticky that is defined above
  // oxlint-disable-next-line unicorn/consistent-function-scoping
  const App = () => {
    const navigate = useNavigate()

    useEffect(() => {
      // Navigate to /intermediate (would unmount Sticky), then immediately
      // back to /start (where Sticky lives). With batching, Sticky should
      // never unmount because React only renders the final location.
      Promise.resolve()
        .then(() => {
          navigate('/intermediate')
          navigate('/start')
        })
        .catch(() => undefined)
    }, [navigate])

    return (
      <Switch>
        <Route path="/intermediate" render={() => <div>Intermediate</div>} />
        <Route render={() => <Sticky />} />
      </Switch>
    )
  }

  const screen = await render(
    <Router history={history}>
      <App />
    </Router>,
  )

  expect(screen.getByText('Sticky').element()).toBeDefined()

  await act(async () => {
    await Promise.resolve()
  })

  expect(unmountCount).toBe(0)
  expect(screen.getByText('Sticky').element()).toBeDefined()
})
