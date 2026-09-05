// oxlint-disable vitest/require-top-level-describe typescript/unbound-method
import { render, renderHook } from '@testing-library/react'
import { createMemoryHistory as createHistory } from 'history'
import { describe, expect, it, test } from 'vitest'
import { MemoryRouter, Route, useHistory } from '../index'
import { Router } from '../Router'

describe('without a <Router>', () => {
  it('throws an error', () => {
    function TestComponent() {
      useHistory()
      return null
    }

    expect(() => {
      render(
        <div>
          <TestComponent />
        </div>,
      )
    }).toThrow(/Missing RouterContext/u)
  })
})

test('returns history object from context', () => {
  const { result } = renderHook(() => useHistory(), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current).toBeDefined()
  expect(result.current.push).toBeTypeOf('function')
  expect(result.current.replace).toBeTypeOf('function')
  expect(result.current.go).toBeTypeOf('function')
  expect(result.current.back).toBeTypeOf('function')
  expect(result.current.forward).toBeTypeOf('function')
  expect(result.current.createHref).toBeTypeOf('function')
})

test('history object has location property', () => {
  const { result } = renderHook(() => useHistory(), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/test']}>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current.location).toBeDefined()
  expect(result.current.location.pathname).toBe('/test')
})

test('history object is stable across re-renders', () => {
  const { result, rerender } = renderHook(() => useHistory(), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  const firstHistory = result.current
  rerender()
  const secondHistory = result.current

  expect(firstHistory).toBe(secondHistory)
})

test('works with Router component', () => {
  const customHistory = createHistory()

  const { result } = renderHook(() => useHistory(), {
    wrapper: ({ children }) => (
      <Router history={customHistory}>
        <Route>{children}</Route>
      </Router>
    ),
  })

  expect(result.current).toBe(customHistory)
})
