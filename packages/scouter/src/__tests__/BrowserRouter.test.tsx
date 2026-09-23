import { render, renderHook, screen } from '@testing-library/react'
import { assert, describe, expect, it } from 'vitest'
import type { Location, Match } from '../index'
import { BrowserRouter, Route, useHistory } from '../index'

describe('component BrowserRouter', () => {
  it('renders children', () => {
    expect.hasAssertions()

    const text = 'Hello BrowserRouter'

    render(
      <BrowserRouter>
        <div>{text}</div>
      </BrowserRouter>,
    )

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it('creates browser history', () => {
    expect.hasAssertions()

    const { result } = renderHook(() => useHistory(), {
      wrapper: BrowserRouter,
    })

    expect(result.current).toBeDefined()
    // oxlint-disable vitest/prefer-expect-type-of
    expect(typeof result.current.push).toBe('function')
    expect(typeof result.current.replace).toBe('function')
    // oxlint-enable vitest/prefer-expect-type-of
  })

  it('history is re-created for each BrowserRouter', () => {
    expect.hasAssertions()

    const first = renderHook(() => useHistory(), { wrapper: BrowserRouter })
    const second = renderHook(() => useHistory(), { wrapper: BrowserRouter })

    expect(first.result.current).not.toBe(second.result.current)
  })

  it('provides root route context', () => {
    expect.hasAssertions()

    let match: Partial<Match> = {}

    render(
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

  it('uses current browser location', () => {
    expect.hasAssertions()

    let location: Partial<Location> = {}

    render(
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
