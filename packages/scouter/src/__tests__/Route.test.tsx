// oxlint-disable vitest/require-top-level-describe
import { createMemoryHistory as createHistory } from 'history'
import { useEffect } from 'react'
import { assert, describe, expect, it, test, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import type { RouteRenderProps } from '../index'
import { MemoryRouter, Route } from '../index'
import { Router } from '../Router'
import { act } from './utils/reactAct'

describe('without a <Router>', () => {
  it('throws an error', async () => {
    vi.spyOn(console, 'error').mockReturnValue(undefined)

    await expect(render(<Route />)).rejects.toThrow(/Missing RouterContext/v)
  })
})

describe('with a child element', () => {
  it('renders when it matches', async () => {
    const text = 'cupcakes'

    const screen = await render(
      <MemoryRouter initialEntries={['/cupcakes']}>
        <Route path="/cupcakes">
          <h1>{text}</h1>
        </Route>
      </MemoryRouter>,
    )

    expect(screen.getByText(text).element()).toBeDefined()
  })

  it('renders when it matches at the root URL', async () => {
    const text = 'cupcakes'

    const screen = await render(
      <MemoryRouter initialEntries={['/']}>
        <Route path="/">
          <h1>{text}</h1>
        </Route>
      </MemoryRouter>,
    )

    expect(screen.getByText(text).element()).toBeDefined()
  })

  it('does not render when it does not match', async () => {
    const text = 'bubblegum'

    const screen = await render(
      <MemoryRouter initialEntries={['/bunnies']}>
        <Route path="/flowers">
          <h1>{text}</h1>
        </Route>
      </MemoryRouter>,
    )

    expect(screen.getByText(text).query()).toBeNull()
  })
})

describe('with a render prop', () => {
  it('renders when it matches', async () => {
    const text = 'cupcakes'

    const screen = await render(
      <MemoryRouter initialEntries={['/cupcakes']}>
        <Route path="/cupcakes" render={() => <h1>{text}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText(text).element()).toBeDefined()
  })

  it('renders when it matches at the root URL', async () => {
    const text = 'cupcakes'

    const screen = await render(
      <MemoryRouter initialEntries={['/']}>
        <Route path="/" render={() => <h1>{text}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText(text).element()).toBeDefined()
  })

  it('does not render when it does not match', async () => {
    const text = 'bubblegum'

    const screen = await render(
      <MemoryRouter initialEntries={['/bunnies']}>
        <Route path="/flowers" render={() => <h1>{text}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText(text).query()).toBeNull()
  })
})

test('matches using nextContext when updating', async () => {
  const history = createHistory({
    initialEntries: ['/sushi/california'],
  })

  const screen = await render(
    <Router history={history}>
      <Route path="/sushi/:roll" render={({ match }) => <h1>{match.params['roll']}</h1>} />
    </Router>,
  )

  await act(() => {
    history.push('/sushi/spicy-tuna')
  })

  expect(screen.getByText('spicy-tuna').element()).toBeDefined()
})

describe('with dynamic segments in the path', () => {
  it('decodes them', async () => {
    const screen = await render(
      <MemoryRouter initialEntries={['/a%20dynamic%20segment']}>
        <Route path="/:id" render={({ match }) => <h1>{match.params['id']}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText('a dynamic segment').element()).toBeDefined()
  })
})

describe('with an array of paths', () => {
  it('matches the first provided path', async () => {
    const screen = await render(
      <MemoryRouter initialEntries={['/hello']}>
        <Route path={['/hello', '/world']} render={() => <div>Hello World</div>} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Hello World').element()).toBeDefined()
  })

  it('matches other provided paths', async () => {
    const screen = await render(
      <MemoryRouter initialEntries={['/other', '/world']} initialIndex={1}>
        <Route path={['/hello', '/world']} render={() => <div>Hello World</div>} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Hello World').element()).toBeDefined()
  })

  it("doesn't remount when moving from one matching path to another", async () => {
    const history = createHistory()
    const mount = vi.fn<() => void>()
    const MatchedRoute = () => {
      useEffect(() => {
        mount()
      }, [])
      return <div>Hello World</div>
    }

    history.push('/hello')

    const screen = await render(
      <Router history={history}>
        <Route path={['/hello', '/world']} render={() => <MatchedRoute />} />
      </Router>,
    )

    expect(mount).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Hello World').element()).toBeDefined()

    await act(() => {
      history.push('/world/somewhere/else')
    })

    expect(mount).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Hello World').element()).toBeDefined()
  })
})

describe('with a unicode path', () => {
  it('is able to match', async () => {
    const screen = await render(
      <MemoryRouter initialEntries={['/パス名']}>
        <Route path="/パス名" render={() => <h1>Matched</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Matched').element()).toBeDefined()
  })
})

describe('with `exact=true`', () => {
  it('renders when the URL does not have a trailing slash', async () => {
    const text = 'bubblegum'

    const screen = await render(
      <MemoryRouter initialEntries={['/somepath/']}>
        <Route exact path="/somepath" render={() => <h1>{text}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText(text).element()).toBeDefined()
  })

  it('renders when the URL has trailing slash', async () => {
    const text = 'bubblegum'

    const screen = await render(
      <MemoryRouter initialEntries={['/somepath']}>
        <Route exact path="/somepath/" render={() => <h1>{text}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText(text).element()).toBeDefined()
  })
})

describe('the `children` prop', () => {
  describe('that is an element', () => {
    it('renders', async () => {
      const text = 'bubblegum'

      const screen = await render(
        <MemoryRouter initialEntries={['/']}>
          <Route path="/">
            <h1>{text}</h1>
          </Route>
        </MemoryRouter>,
      )

      expect(screen.getByText(text).element()).toBeDefined()
    })
  })
})

describe('the `render` prop', () => {
  it('renders its return value', async () => {
    const text = 'Mrs. Kato'

    const screen = await render(
      <MemoryRouter initialEntries={['/']}>
        <Route path="/" render={() => <h1>{text}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText(text).element()).toBeDefined()
  })

  it('receives { match, location } props', async () => {
    const history = createHistory()

    let props: Partial<RouteRenderProps> = {}
    await render(
      <Router history={history}>
        <Route
          path="/"
          render={p => {
            props = p
            return null
          }}
        />
      </Router>,
    )

    assert.exists(props)
    expect(Object.keys(props)).toStrictEqual(['match', 'location', 'history'])
  })
})
