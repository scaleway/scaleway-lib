// oxlint-disable vitest/require-top-level-describe
import { render, screen } from '@testing-library/react'
import { describe, expect, it, test, vi } from 'vitest'
import { MemoryRouter, Redirect, Route, Switch } from '../index'

describe('without a <Router>', () => {
  it('throws an error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<Switch>Hello</Switch>)
    }).toThrow(/Missing RouterContext/u)
  })
})

test('renders the first <Route> that matches the URL', () => {
  render(
    <MemoryRouter initialEntries={['/one']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        <Route path="/two" render={() => <h1>two</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('one')).toBeInTheDocument()
})

test('does not render a second <Route> that also matches the URL', () => {
  render(
    <MemoryRouter initialEntries={['/one']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        <Route path="/one" render={() => <h1>two</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.queryByText('two')).not.toBeInTheDocument()
})

test('renders the first <Redirect> that matches the URL', () => {
  render(
    <MemoryRouter initialEntries={['/three']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        <Route path="/two" render={() => <h1>two</h1>} />
        <Redirect from="/three" to="/two" />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('two')).toBeInTheDocument()
})

test('does not render a second <Redirect> that also matches the URL', () => {
  render(
    <MemoryRouter initialEntries={['/three']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        <Route path="/two" render={() => <h1>two</h1>} />
        <Redirect from="/three" to="/two" />
        <Redirect from="/three" to="/one" />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('two')).toBeInTheDocument()
})

test('renders a Route with no `path` prop', () => {
  render(
    <MemoryRouter initialEntries={['/two']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        <Route render={() => <h1>two</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('two')).toBeInTheDocument()
})

test('renders a Redirect with no `from` prop', () => {
  render(
    <MemoryRouter initialEntries={['/three']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        <Redirect to="/one" />
        <Route path="/two" render={() => <h1>two</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('one')).toBeInTheDocument()
})

test('handles subsequent redirects', () => {
  render(
    <MemoryRouter initialEntries={['/one']}>
      <Switch>
        <Redirect from="/one" to="/two" />
        <Redirect from="/two" to="/three" />
        <Route path="/three" render={() => <h1>three</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('three')).toBeInTheDocument()
})

test('handles comments', () => {
  render(
    <MemoryRouter initialEntries={['/cupcakes']}>
      <Switch>
        <Route path="/bubblegum" render={() => <div>bub</div>} />
        {/* this is a comment */}
        <Route path="/cupcakes" render={() => <div>cup</div>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.queryByText('bub')).not.toBeInTheDocument()
  expect(screen.getByText('cup')).toBeInTheDocument()
})

test('renders with non-element children', () => {
  render(
    <MemoryRouter initialEntries={['/one']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        {false}
        {undefined}
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText(/one/u)).toBeInTheDocument()
})

test('handles path as array with valid strings', () => {
  render(
    <MemoryRouter initialEntries={['/test']}>
      <Switch>
        <Route path={['/one', '/test']} render={() => <h1>matched</h1>} />
        <Route path="/other" render={() => <h1>other</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('matched')).toBeInTheDocument()
})

test('handles from as array with valid strings', () => {
  render(
    <MemoryRouter initialEntries={['/redirect-target']}>
      <Switch>
        <Route path="/other" render={() => <h1>other</h1>} />
        <Route path="/matched" render={() => <h1>matched</h1>} />
        <Redirect from={['/one', '/redirect-target']} to="/matched" />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('matched')).toBeInTheDocument()
})

test('handles element without props', () => {
  const CustomRoute = ({ children }: { children: React.ReactNode }) => <div>{children}</div>

  render(
    <MemoryRouter initialEntries={['/test']}>
      <Switch>
        <CustomRoute>Fallback content</CustomRoute>
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('Fallback content')).toBeInTheDocument()
})

test('uses parent route match when no path is provided', () => {
  render(
    <MemoryRouter initialEntries={['/parent/child']}>
      <Route path="/parent/:id">
        <Switch>
          <Route path="/other" render={() => <h1>other</h1>} />
          <Route render={() => <h1>child matched</h1>} />
        </Switch>
      </Route>
    </MemoryRouter>,
  )

  expect(screen.getByText('child matched')).toBeInTheDocument()
})

test('handles exact prop', () => {
  render(
    <MemoryRouter initialEntries={['/test/extra']}>
      <Switch>
        <Route path="/test" exact render={() => <h1>exact</h1>} />
        <Route path="/test" render={() => <h1>loose</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('loose')).toBeInTheDocument()
})

test('handles exact match with exact=true', () => {
  render(
    <MemoryRouter initialEntries={['/test']}>
      <Switch>
        <Route path="/test" exact render={() => <h1>exact match</h1>} />
        <Route render={() => <h1>fallback</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('exact match')).toBeInTheDocument()
})
