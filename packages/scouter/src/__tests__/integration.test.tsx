// oxlint-disable vitest/prefer-expect-assertions vitest/require-top-level-describe typescript/no-explicit-any react/no-multi-comp
import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import { createMemoryHistory as createHistory } from 'history'
import { describe, expect, it, test } from 'vitest'
import { MemoryRouter, Redirect, Route, Switch, useLocation } from '../index'
import { Router } from '../Router'

test('renders routes correctly', () => {
  render(
    <MemoryRouter initialEntries={['/users/123']}>
      <Route path="/users/:userId" render={({ match }) => <h1>User {match.params['userId']}</h1>} />
    </MemoryRouter>,
  )

  expect(screen.getByText('User 123')).toBeInTheDocument()
})

test('updates when navigating', () => {
  const history = createHistory({ initialEntries: ['/page1'] })

  let locations: any[] = []

  function LocationTracker() {
    const location = useLocation()
    locations.push(location.pathname)
    return <div>{location.pathname}</div>
  }

  render(
    <Router history={history}>
      <Route>
        <LocationTracker />
      </Route>
    </Router>,
  )

  act(() => {
    history.push('/page2')
  })

  expect(locations).toContain('/page1')
  expect(locations).toContain('/page2')
})

test('handles multiple redirects', () => {
  render(
    <MemoryRouter initialEntries={['/redirect1']}>
      <Switch>
        <Redirect from="/redirect1" to="/redirect2" />
        <Redirect from="/redirect2" to="/final" />
        <Route path="/final" render={() => <h1>Final</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('Final')).toBeInTheDocument()
})

describe('route with exact and strict', () => {
  it('exact matches exactly', () => {
    render(
      <MemoryRouter initialEntries={['/test']}>
        <Route exact path="/test" render={() => <h1>Matched</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Matched')).toBeInTheDocument()
  })

  it('exact does not match with extra segments', () => {
    render(
      <MemoryRouter initialEntries={['/test/extra']}>
        <Route exact path="/test" render={() => <h1>Matched</h1>} />
      </MemoryRouter>,
    )

    expect(screen.queryByText('Matched')).not.toBeInTheDocument()
  })
})

test('renders all matching routes', () => {
  render(
    <MemoryRouter initialEntries={['/test']}>
      <Route path="/test" render={() => <h1>First</h1>} />
      <Route path="/test" render={() => <h1>Second</h1>} />
    </MemoryRouter>,
  )

  expect(screen.getByText('First')).toBeInTheDocument()
  expect(screen.getByText('Second')).toBeInTheDocument()
})

test('location changes trigger re-renders', () => {
  const history = createHistory({
    initialEntries: ['/initial'],
  })

  let renderCount = 0

  function Counter() {
    const location = useLocation()
    renderCount++
    return <div>{location.pathname}</div>
  }

  render(
    <Router history={history}>
      <Route>
        <Counter />
      </Route>
    </Router>,
  )

  const countAfterInitial = renderCount

  act(() => {
    history.push('/new')
  })

  expect(renderCount).toBeGreaterThan(countAfterInitial)
})
