import { describe, expect, it } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { MemoryRouter, Route, useLocation } from '../index'

describe(useLocation, () => {
  it('returns current location', async () => {
    const { result } = await renderHook(() => useLocation(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test-path']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current).toBeDefined()
    expect(result.current.pathname).toBe('/test-path')
  })

  it('location has correct properties', async () => {
    const { result } = await renderHook(() => useLocation(), {
      wrapper: ({ children }) => (
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/test',
              search: '?foo=bar',
              hash: '#section',
              state: { from: 'home' },
            },
          ]}
        >
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.pathname).toBe('/test')
    expect(result.current.search).toBe('?foo=bar')
    expect(result.current.hash).toBe('#section')
    expect(result.current.state).toStrictEqual({ from: 'home' })
  })

  it('updates when location changes', async () => {
    const { result } = await renderHook(() => useLocation(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/first']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.pathname).toBe('/first')
  })

  it('works without explicit Route', async () => {
    const { result } = await renderHook(() => useLocation(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/path']}>{children}</MemoryRouter>,
    })

    expect(result.current.pathname).toBe('/path')
  })
})
