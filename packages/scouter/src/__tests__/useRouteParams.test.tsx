// oxlint-disable vitest/require-top-level-describe
import { renderHook } from '@testing-library/react'
import { expect, test } from 'vitest'
import { createRoute, MemoryRouter, Route, useRouteParams } from '../index'

test('returns params from route context', () => {
  const { result } = renderHook(() => useRouteParams(createRoute('/users/:id')), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/users/123']}>
        <Route path="/users/:id">{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current).toEqual({ id: '123' })
})

test('updates when route changes', () => {
  const { result } = renderHook(() => useRouteParams(createRoute('/users/:id')), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/users/first']}>
        <Route path="/users/:id">{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current.id).toBe('first')
})

test('returns empty object when no params', () => {
  const { result } = renderHook(() => useRouteParams(createRoute('/static')), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/static']}>
        <Route path="/static">{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current).toEqual({})
})
