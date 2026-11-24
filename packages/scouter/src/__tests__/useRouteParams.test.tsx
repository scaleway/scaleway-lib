// oxlint-disable vitest/require-top-level-describe
import { expect, test } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { createRoute, MemoryRouter, Route, useRouteParams } from '../index'

test('returns params from route context', async () => {
  const { result } = await renderHook(() => useRouteParams(createRoute('/users/:id')), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/users/123']}>
        <Route path="/users/:id">{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current).toStrictEqual({ id: '123' })
})

test('updates when route changes', async () => {
  const { result } = await renderHook(() => useRouteParams(createRoute('/users/:id')), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/users/first']}>
        <Route path="/users/:id">{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current.id).toBe('first')
})

test('returns empty object when no params', async () => {
  const { result } = await renderHook(() => useRouteParams(createRoute('/static')), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/static']}>
        <Route path="/static">{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current).toStrictEqual({})
})
