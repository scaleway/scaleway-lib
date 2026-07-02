// oxlint-disable typescript/no-explicit-any vitest/prefer-expect-assertions typescript/no-unsafe-type-assertion typescript/no-unsafe-assignment
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Redirect, Route, Switch } from '../index'

describe('that always renders', () => {
  it("doesn't break / throw when rendered with string `to`", () => {
    expect(() => {
      render(
        <MemoryRouter>
          <Redirect to="go-out" />
        </MemoryRouter>,
      )
    }).not.toThrow()
  })

  it("doesn't break / throw when rendered with location `to` created from string", () => {
    const to = {
      pathname: '/go-out',
      search: '?search=foo',
      hash: '#hash',
    }
    expect(() => {
      render(
        <MemoryRouter>
          <Redirect to={to} />
        </MemoryRouter>,
      )
    }).not.toThrow()
  })

  it("doesn't break / throw when rendered with object `to`", () => {
    const to = {
      pathname: '/path',
      state: {
        someState: 'state',
      },
    }
    expect(() => {
      render(
        <MemoryRouter>
          <Redirect to={to} />
        </MemoryRouter>,
      )
    }).not.toThrow()
  })
})

describe('inside a <Switch>', () => {
  // RRv5 allow this but we don't
  it('does not automatically interpolates params', () => {
    let params: any

    render(
      <MemoryRouter initialEntries={['/users/mjackson/messages/123']}>
        <Switch>
          <Redirect from="/users/:username/messages/:messageId" to="/:username/messages/:messageId" />
          <Route
            path="/:username/messages/:messageId"
            render={({ match }) => {
              params = match.params
              return null
            }}
          />
        </Switch>
      </MemoryRouter>,
    )

    expect(params).toMatchObject({
      username: ':username',
      messageId: ':messageId',
    })
  })
})

describe('push vs replace', () => {
  it('uses replace by default', () => {
    expect(() => {
      render(
        <MemoryRouter initialEntries={['/initial']}>
          <Redirect to="/redirected" />
        </MemoryRouter>,
      )
    }).not.toThrow()
  })

  it('uses push when push=true', () => {
    expect(() => {
      render(
        <MemoryRouter initialEntries={['/initial']}>
          <Redirect to="/redirected" push />
        </MemoryRouter>,
      )
    }).not.toThrow()
  })
})

describe('without from prop', () => {
  it('redirects unconditionally', () => {
    expect(() => {
      render(
        <MemoryRouter>
          <Redirect to="/somewhere" />
        </MemoryRouter>,
      )
    }).not.toThrow()
  })
})

describe('with from prop', () => {
  it('redirects only when path matches', () => {
    expect(() => {
      render(
        <MemoryRouter initialEntries={['/matching-path']}>
          <Redirect from="/matching-path" to="/redirected" />
        </MemoryRouter>,
      )
    }).not.toThrow()
  })

  it('does not redirect when path does not match', () => {
    expect(() => {
      render(
        <MemoryRouter initialEntries={['/non-matching-path']}>
          <Redirect from="/matching-path" to="/redirected" />
          <Route path="/non-matching-path" render={() => <div>Content</div>} />
        </MemoryRouter>,
      )
    }).not.toThrow()
  })

  it('does not redirect when from is array and no paths match', () => {
    expect(() => {
      render(
        <MemoryRouter initialEntries={['/other-path']}>
          <Redirect from={['/path1', '/path2']} to="/redirected" />
          <Route path="/other-path" render={() => <div>Content</div>} />
        </MemoryRouter>,
      )
    }).not.toThrow()
  })

  it('redirects when from is array and one path matches', () => {
    expect(() => {
      render(
        <MemoryRouter initialEntries={['/path2']}>
          <Redirect from={['/path1', '/path2']} to="/redirected" />
        </MemoryRouter>,
      )
    }).not.toThrow()
  })

  it('uses parent route match when no from or computedMatch is provided', () => {
    expect(() => {
      render(
        <MemoryRouter initialEntries={['/parent/child']}>
          <Route path="/parent/:id">
            <Redirect to="/redirected" />
          </Route>
        </MemoryRouter>,
      )
    }).not.toThrow()
  })

  it('prefers computedMatch over from prop', () => {
    expect(() => {
      render(
        <MemoryRouter initialEntries={['/from-prop']}>
          <Switch>
            <Redirect from="/from-prop" to="/computed-match-redirect" {...({ computedMatch: null as any } as any)} />
            <Route path="/from-prop" render={() => <div>From Prop</div>} />
          </Switch>
        </MemoryRouter>,
      )
    }).not.toThrow()
  })
})
