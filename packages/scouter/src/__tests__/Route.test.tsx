// oxlint-disable vitest/prefer-expect-assertions vitest/require-top-level-describe
import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import { createMemoryHistory as createHistory } from 'history'
import { useEffect } from 'react'
import { describe, expect, it, test, vi } from 'vitest'
import type { RouteRenderProps } from '../index'
import { MemoryRouter, Route } from '../index'
import { Router } from '../Router'

describe('without a <Router>', () => {
  it('throws an error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<Route />)
    }).toThrow(/Missing RouterContext/u)
  })
})

describe('with a child element', () => {
  it('renders when it matches', () => {
    const text = 'cupcakes'

    render(
      <MemoryRouter initialEntries={['/cupcakes']}>
        <Route path="/cupcakes">
          <h1>{text}</h1>
        </Route>
      </MemoryRouter>,
    )

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('renders when it matches at the root URL', () => {
    const text = 'cupcakes'

    render(
      <MemoryRouter initialEntries={['/']}>
        <Route path="/">
          <h1>{text}</h1>
        </Route>
      </MemoryRouter>,
    )

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('does not render when it does not match', () => {
    const text = 'bubblegum'

    render(
      <MemoryRouter initialEntries={['/bunnies']}>
        <Route path="/flowers">
          <h1>{text}</h1>
        </Route>
      </MemoryRouter>,
    )

    expect(screen.queryByText(text)).not.toBeInTheDocument()
  })
})

describe('with a render prop', () => {
  it('renders when it matches', () => {
    const text = 'cupcakes'

    render(
      <MemoryRouter initialEntries={['/cupcakes']}>
        <Route path="/cupcakes" render={() => <h1>{text}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('renders when it matches at the root URL', () => {
    const text = 'cupcakes'

    render(
      <MemoryRouter initialEntries={['/']}>
        <Route path="/" render={() => <h1>{text}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('does not render when it does not match', () => {
    const text = 'bubblegum'

    render(
      <MemoryRouter initialEntries={['/bunnies']}>
        <Route path="/flowers" render={() => <h1>{text}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.queryByText(text)).not.toBeInTheDocument()
  })
})

test('matches using nextContext when updating', () => {
  const history = createHistory({
    initialEntries: ['/sushi/california'],
  })

  render(
    <Router history={history}>
      <Route path="/sushi/:roll" render={({ match }) => <h1>{match.params['roll']}</h1>} />
    </Router>,
  )

  act(() => {
    history.push('/sushi/spicy-tuna')
  })

  expect(screen.getByText('spicy-tuna')).toBeInTheDocument()
})

describe('with dynamic segments in the path', () => {
  it('decodes them', () => {
    render(
      <MemoryRouter initialEntries={['/a%20dynamic%20segment']}>
        <Route path="/:id" render={({ match }) => <h1>{match.params['id']}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText('a dynamic segment')).toBeInTheDocument()
  })
})

describe('with an array of paths', () => {
  it('matches the first provided path', () => {
    render(
      <MemoryRouter initialEntries={['/hello']}>
        <Route path={['/hello', '/world']} render={() => <div>Hello World</div>} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('matches other provided paths', () => {
    render(
      <MemoryRouter initialEntries={['/other', '/world']} initialIndex={1}>
        <Route path={['/hello', '/world']} render={() => <div>Hello World</div>} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it("doesn't remount when moving from one matching path to another", () => {
    const history = createHistory()
    const mount = vi.fn<() => void>()
    const MatchedRoute = () => {
      useEffect(() => {
        mount()
      }, [])
      return <div>Hello World</div>
    }

    act(() => {
      history.push('/hello')
    })

    render(
      <Router history={history}>
        <Route path={['/hello', '/world']} render={() => <MatchedRoute />} />
      </Router>,
    )

    expect(mount).toHaveBeenCalledOnce()
    expect(screen.getByText('Hello World')).toBeInTheDocument()

    act(() => {
      history.push('/world/somewhere/else')
    })

    expect(mount).toHaveBeenCalledOnce()
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})

describe('with a unicode path', () => {
  it('is able to match', () => {
    render(
      <MemoryRouter initialEntries={['/パス名']}>
        <Route path="/パス名" render={() => <h1>Matched</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Matched')).toBeInTheDocument()
  })
})

describe('with `exact=true`', () => {
  it('renders when the URL does not have a trailing slash', () => {
    const text = 'bubblegum'

    render(
      <MemoryRouter initialEntries={['/somepath/']}>
        <Route exact path="/somepath" render={() => <h1>{text}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('renders when the URL has trailing slash', () => {
    const text = 'bubblegum'

    render(
      <MemoryRouter initialEntries={['/somepath']}>
        <Route exact path="/somepath/" render={() => <h1>{text}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText(text)).toBeInTheDocument()
  })
})

describe('the `children` prop', () => {
  describe('that is an element', () => {
    it('renders', () => {
      const text = 'bubblegum'

      render(
        <MemoryRouter initialEntries={['/']}>
          <Route path="/">
            <h1>{text}</h1>
          </Route>
        </MemoryRouter>,
      )

      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })
})

describe('the `render` prop', () => {
  it('renders its return value', () => {
    const text = 'Mrs. Kato'

    render(
      <MemoryRouter initialEntries={['/']}>
        <Route path="/" render={() => <h1>{text}</h1>} />
      </MemoryRouter>,
    )

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('receives { match, location } props', () => {
    const history = createHistory()

    let props: RouteRenderProps
    render(
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

    expect(props!).not.toBe(null)
    expect(Object.keys(props!)).toEqual(['match', 'location', 'history'])
  })
})
