import { assert, describe, expect, it } from 'vitest'
import { render, renderHook } from 'vitest-browser-react'
import type { Location, Match } from '../index'
import { BrowserRouter, Route, useHistory } from '../index'

describe('component BrowserRouter', () => {
  it('renders children', async () => {
    expect.hasAssertions()

    const text = 'Hello BrowserRouter'

    const screen = await render(
      <BrowserRouter>
        <div>{text}</div>
      </BrowserRouter>,
    )

    expect(screen.getByText(text).element()).toBeDefined()
  })

  it('creates browser history', async () => {
    expect.hasAssertions()

    const { result } = await renderHook(() => useHistory(), {
      wrapper: BrowserRouter,
    })

    expect(result.current).toBeDefined()
    // oxlint-disable vitest/prefer-expect-type-of
    expect(typeof result.current.push).toBe('function')
    expect(typeof result.current.replace).toBe('function')
    // oxlint-enable vitest/prefer-expect-type-of
  })

  it('history is re-created for each BrowserRouter', async () => {
    expect.hasAssertions()

    const first = await renderHook(() => useHistory(), { wrapper: BrowserRouter })
    const second = await renderHook(() => useHistory(), { wrapper: BrowserRouter })

    expect(first.result.current).not.toBe(second.result.current)
  })

  it('provides root route context', async () => {
    expect.hasAssertions()

    let match: Partial<Match> = {}

    await render(
      <BrowserRouter>
        <Route
          render={({ match: matchProps }) => {
            match = matchProps
            return null
          }}
        />
      </BrowserRouter>,
    )

    assert.exists(match.params)
    expect(match.params).toStrictEqual({})
  })

  it('uses current browser location', async () => {
    expect.hasAssertions()

    let location: Partial<Location> = {}

    await render(
      <BrowserRouter>
        <Route
          render={({ location: locationProps }) => {
            location = locationProps
            return null
          }}
        />
      </BrowserRouter>,
    )

    assert.exists(location.pathname)
    expect(location.pathname).toBeTypeOf('string')
  })
})
