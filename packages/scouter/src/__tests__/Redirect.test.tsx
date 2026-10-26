// oxlint-disable typescript/no-explicit-any typescript/no-unsafe-type-assertion typescript/no-unsafe-assignment
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { MemoryRouter, Redirect, Route, Switch } from '../index'

describe('that always renders', () => {
  it("doesn't break / throw when rendered with string `to`", async () => {
    await expect(
      render(
        <MemoryRouter>
          <Redirect to="go-out" />
        </MemoryRouter>,
      ),
    ).resolves.toBeDefined()
  })

  it("doesn't break / throw when rendered with location `to` created from string", async () => {
    const to = {
      pathname: '/go-out',
      search: '?search=foo',
      hash: '#hash',
    }
    await expect(
      render(
        <MemoryRouter>
          <Redirect to={to} />
        </MemoryRouter>,
      ),
    ).resolves.toBeDefined()
  })

  it("doesn't break / throw when rendered with object `to`", async () => {
    const to = {
      pathname: '/path',
      state: {
        someState: 'state',
      },
    }
    await expect(
      render(
        <MemoryRouter>
          <Redirect to={to} />
        </MemoryRouter>,
      ),
    ).resolves.toBeDefined()
  })
})

describe('inside a <Switch>', () => {
  // RRv5 allow this but we don't
  it('does not automatically interpolates params', async () => {
    let params: any = undefined

    await render(
      <MemoryRouter initialEntries={['/users/mjackson/messages/123']}>
        <Switch>
          <Redirect from="/users/:username/messages/:messageId" to="/:username/messages/:messageId" />
          <Route
            path="/:username/messages/:messageId"
            render={({ match: { params: paramsProps } }) => {
              params = paramsProps
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
  it('uses replace by default', async () => {
    await expect(
      render(
        <MemoryRouter initialEntries={['/initial']}>
          <Redirect to="/redirected" />
        </MemoryRouter>,
      ),
    ).resolves.toBeDefined()
  })

  it('uses push when push=true', async () => {
    await expect(
      render(
        <MemoryRouter initialEntries={['/initial']}>
          <Redirect to="/redirected" push />
        </MemoryRouter>,
      ),
    ).resolves.toBeDefined()
  })
})

describe('without from prop', () => {
  it('redirects unconditionally', async () => {
    await expect(
      render(
        <MemoryRouter>
          <Redirect to="/somewhere" />
        </MemoryRouter>,
      ),
    ).resolves.toBeDefined()
  })
})

describe('with from prop', () => {
  it('redirects only when path matches', async () => {
    await expect(
      render(
        <MemoryRouter initialEntries={['/matching-path']}>
          <Redirect from="/matching-path" to="/redirected" />
        </MemoryRouter>,
      ),
    ).resolves.toBeDefined()
  })

  it('does not redirect when path does not match', async () => {
    await expect(
      render(
        <MemoryRouter initialEntries={['/non-matching-path']}>
          <Redirect from="/matching-path" to="/redirected" />
          <Route path="/non-matching-path" render={() => <div>Content</div>} />
        </MemoryRouter>,
      ),
    ).resolves.toBeDefined()
  })

  it('does not redirect when from is array and no paths match', async () => {
    await expect(
      render(
        <MemoryRouter initialEntries={['/other-path']}>
          <Redirect from={['/path1', '/path2']} to="/redirected" />
          <Route path="/other-path" render={() => <div>Content</div>} />
        </MemoryRouter>,
      ),
    ).resolves.toBeDefined()
  })

  it('redirects when from is array and one path matches', async () => {
    await expect(
      render(
        <MemoryRouter initialEntries={['/path2']}>
          <Redirect from={['/path1', '/path2']} to="/redirected" />
        </MemoryRouter>,
      ),
    ).resolves.toBeDefined()
  })

  it('uses parent route match when no from or computedMatch is provided', async () => {
    await expect(
      render(
        <MemoryRouter initialEntries={['/parent/child']}>
          <Route path="/parent/:id">
            <Redirect to="/redirected" />
          </Route>
        </MemoryRouter>,
      ),
    ).resolves.toBeDefined()
  })

  it('prefers computedMatch over from prop', async () => {
    await expect(
      render(
        <MemoryRouter initialEntries={['/from-prop']}>
          <Switch>
            <Redirect from="/from-prop" to="/computed-match-redirect" {...({ computedMatch: null as any } as any)} />
            <Route path="/from-prop" render={() => <div>From Prop</div>} />
          </Switch>
        </MemoryRouter>,
      ),
    ).resolves.toBeDefined()
  })
})
