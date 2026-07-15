import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, useLocation } from '../index'

describe('useLocation', () => {
  it('returns current location', () => {
    const { result } = renderHook(() => useLocation(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/test-path']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current).toBeDefined()
    expect(result.current.pathname).toBe('/test-path')
  })

  it('location has correct properties', () => {
    const { result } = renderHook(() => useLocation(), {
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
    expect(result.current.state).toEqual({ from: 'home' })
  })

  it('updates when location changes', () => {
    const { result } = renderHook(() => useLocation(), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={['/first']}>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current.pathname).toBe('/first')
  })

  it('works without explicit Route', () => {
    const { result } = renderHook(() => useLocation(), {
      wrapper: ({ children }) => <MemoryRouter initialEntries={['/path']}>{children}</MemoryRouter>,
    })

    expect(result.current.pathname).toBe('/path')
  })
})
