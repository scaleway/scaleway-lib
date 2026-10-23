// oxlint-disable vitest/require-top-level-describe
import { expect, test } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { MemoryRouter, Route, useRouteMatch } from '../index'

test('returns false without path', async () => {
  const { result } = await renderHook(() => useRouteMatch(undefined), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/test']}>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current).toBe(false)
})

test('returns true with matching path', async () => {
  const { result } = await renderHook(() => useRouteMatch('/test'), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/test']}>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current).toBe(true)
})

test('returns false with non-matching path', async () => {
  const { result } = await renderHook(() => useRouteMatch('/other'), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/test']}>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current).toBe(false)
})

test('with exact option', async () => {
  const { result } = await renderHook(
    () => {
      const exactMatch = useRouteMatch('/test', { exact: true })
      const looseMatch = useRouteMatch('/test/extra', { exact: true })
      return { exactMatch, looseMatch }
    },
    {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    },
  )

  expect(result.current.exactMatch).toBe(true)
  expect(result.current.looseMatch).toBe(false)
})

test('updates when location changes', async () => {
  const { result } = await renderHook(() => useRouteMatch('/current'), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/current']}>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current).toBe(true)
})

test('works with dynamic segments', async () => {
  const { result } = await renderHook(() => useRouteMatch('/users/:id'), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/users/123']}>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current).toBe(true)
})

test('works with nested routes', async () => {
  const { result } = await renderHook(
    () => {
      const parentMatch = useRouteMatch('/parent/:id')
      const childMatch = useRouteMatch('/parent/:id/child')
      return { parentMatch, childMatch }
    },
    {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/parent/123/child']}>
          <Route path="/parent/:id">{children}</Route>
        </MemoryRouter>
      ),
    },
  )

  expect(result.current.parentMatch).toBe(true)
  expect(result.current.childMatch).toBe(true)
})
