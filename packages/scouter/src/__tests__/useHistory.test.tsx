// oxlint-disable vitest/require-top-level-describe
import { createMemoryHistory as createHistory } from 'history'
import { assert, describe, expect, it, test } from 'vitest'
import { render, renderHook } from 'vitest-browser-react'
import { MemoryRouter, Route, useHistory } from '../index'
import { Router } from '../Router'

const TestComponent = () => {
  useHistory()
  return null
}

describe('without a <Router>', () => {
  it('throws an error', async () => {
    await expect(
      render(
        <div>
          <TestComponent />
        </div>,
      ),
    ).rejects.toThrow(/Missing RouterContext/v)
  })
})

test('returns history object from context', async () => {
  const { result } = await renderHook(() => useHistory(), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current).toBeDefined()
  assert.exists(result.current)
  // oxlint-disable typescript/unbound-method
  expect(result.current.push).toBeTypeOf('function')
  expect(result.current.replace).toBeTypeOf('function')
  expect(result.current.go).toBeTypeOf('function')
  expect(result.current.back).toBeTypeOf('function')
  expect(result.current.forward).toBeTypeOf('function')
  expect(result.current.createHref).toBeTypeOf('function')
  // oxlint-enable typescript/unbound-method
})

test('history object has location property', async () => {
  const { result } = await renderHook(() => useHistory(), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/test']}>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current.location).toBeDefined()
  expect(result.current.location.pathname).toBe('/test')
})

test('history object is stable across re-renders', async () => {
  const { result, rerender } = await renderHook(() => useHistory(), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  const firstHistory = result.current
  await rerender()
  const secondHistory = result.current

  expect(firstHistory).toBe(secondHistory)
})

test('works with Router component', async () => {
  const customHistory = createHistory()

  const { result } = await renderHook(() => useHistory(), {
    wrapper: ({ children }) => (
      <Router history={customHistory}>
        <Route>{children}</Route>
      </Router>
    ),
  })

  expect(result.current).toBe(customHistory)
})
