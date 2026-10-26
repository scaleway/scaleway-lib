// oxlint-disable vitest/require-top-level-describe
import { describe, expect, it, test, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { MemoryRouter, Redirect, Route, Switch } from '../index'

describe('without a <Router>', () => {
  it('throws an error', async () => {
    vi.spyOn(console, 'error').mockReturnValue(undefined)

    await expect(render(<Switch>Hello</Switch>)).rejects.toThrow(/Missing RouterContext/v)
  })
})

test('renders the first <Route> that matches the URL', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/one']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        <Route path="/two" render={() => <h1>two</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('one').element()).toBeDefined()
})

test('does not render a second <Route> that also matches the URL', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/one']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        <Route path="/one" render={() => <h1>two</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('two').query()).toBeNull()
})

test('renders the first <Redirect> that matches the URL', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/three']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        <Route path="/two" render={() => <h1>two</h1>} />
        <Redirect from="/three" to="/two" />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('two').element()).toBeDefined()
})

test('does not render a second <Redirect> that also matches the URL', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/three']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        <Route path="/two" render={() => <h1>two</h1>} />
        <Redirect from="/three" to="/two" />
        <Redirect from="/three" to="/one" />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('two').element()).toBeDefined()
})

test('renders a Route with no `path` prop', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/two']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        <Route render={() => <h1>two</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('two').element()).toBeDefined()
})

test('renders a Redirect with no `from` prop', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/three']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        <Redirect to="/one" />
        <Route path="/two" render={() => <h1>two</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('one').element()).toBeDefined()
})

test('handles subsequent redirects', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/one']}>
      <Switch>
        <Redirect from="/one" to="/two" />
        <Redirect from="/two" to="/three" />
        <Route path="/three" render={() => <h1>three</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('three').element()).toBeDefined()
})

test('handles comments', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/cupcakes']}>
      <Switch>
        <Route path="/bubblegum" render={() => <div>bub</div>} />
        {/* this is a comment */}
        <Route path="/cupcakes" render={() => <div>cup</div>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('bub').query()).toBeNull()
  expect(screen.getByText('cup').element()).toBeDefined()
})

test('renders with non-element children', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/one']}>
      <Switch>
        <Route path="/one" render={() => <h1>one</h1>} />
        {false}
        {undefined}
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText(/one/v).element()).toBeDefined()
})

test('handles path as array with valid strings', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/test']}>
      <Switch>
        <Route path={['/one', '/test']} render={() => <h1>matched</h1>} />
        <Route path="/other" render={() => <h1>other</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('matched').element()).toBeDefined()
})

test('handles from as array with valid strings', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/redirect-target']}>
      <Switch>
        <Route path="/other" render={() => <h1>other</h1>} />
        <Route path="/matched" render={() => <h1>matched</h1>} />
        <Redirect from={['/one', '/redirect-target']} to="/matched" />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('matched').element()).toBeDefined()
})

const CustomRoute = ({ children }: { children: React.ReactNode }) => <div>{children}</div>

test('handles element without props', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/test']}>
      <Switch>
        <CustomRoute>Fallback content</CustomRoute>
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('Fallback content').element()).toBeDefined()
})

test('uses parent route match when no path is provided', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/parent/child']}>
      <Route path="/parent/:id">
        <Switch>
          <Route path="/other" render={() => <h1>other</h1>} />
          <Route render={() => <h1>child matched</h1>} />
        </Switch>
      </Route>
    </MemoryRouter>,
  )

  expect(screen.getByText('child matched').element()).toBeDefined()
})

test('handles exact prop', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/test/extra']}>
      <Switch>
        <Route path="/test" exact render={() => <h1>exact</h1>} />
        <Route path="/test" render={() => <h1>loose</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('loose').element()).toBeDefined()
})

test('handles exact match with exact=true', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/test']}>
      <Switch>
        <Route path="/test" exact render={() => <h1>exact match</h1>} />
        <Route render={() => <h1>fallback</h1>} />
      </Switch>
    </MemoryRouter>,
  )

  expect(screen.getByText('exact match').element()).toBeDefined()
})
