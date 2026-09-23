import { act, renderHook } from '@testing-library/react'
import { assert, describe, expect, it } from 'vitest'
import type { Location } from '../index'
import { MemoryRouter, Route, useLocation, useNavigate } from '../index'

describe(useNavigate, () => {
  it('returns navigate function', () => {
    const { result } = renderHook(() => useNavigate(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(result.current).toBeTypeOf('function')
  })

  it('navigate with string path', () => {
    let location: Partial<Location> = {}

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              // false positive
              // oxlint-disable-next-line typescript/promise-function-async
              render={({ location: locationProps }) => {
                location = locationProps
                return children
              }}
            />
          </MemoryRouter>
        ),
      },
    )

    act(() => {
      result.current.navigate('/target')
    })

    assert.exists(location)
    expect(location.pathname).toBe('/target')
  })

  it('navigate with object', () => {
    let location: Partial<Location> = {}

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              // false positive
              // oxlint-disable-next-line typescript/promise-function-async
              render={({ location: locationProps }) => {
                location = locationProps
                return children
              }}
            />
          </MemoryRouter>
        ),
      },
    )

    act(() => {
      result.current.navigate({ pathname: '/target', search: '?foo=bar' })
    })

    assert.exists(location)
    expect(location.pathname).toBe('/target')
    expect(location.search).toBe('?foo=bar')
  })

  it('navigate updates location', () => {
    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        const location = useLocation()
        return { navigate, location }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route>{children}</Route>
          </MemoryRouter>
        ),
      },
    )

    expect(result.current.location.pathname).toBe('/initial')

    act(() => {
      result.current.navigate('/updated')
    })

    expect(result.current.location.pathname).toBe('/updated')
  })

  it('navigate with state', () => {
    let location: Partial<Location> = {}

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              // false positive
              // oxlint-disable-next-line typescript/promise-function-async
              render={({ location: locationProps }) => {
                location = locationProps
                return children
              }}
            />
          </MemoryRouter>
        ),
      },
    )

    act(() => {
      result.current.navigate({ pathname: '/target' }, { state: { from: 'home' } })
    })

    assert.exists(location)
    expect(location.state).toStrictEqual({ from: 'home' })
  })

  it('navigate with hash', () => {
    let location: Partial<Location> = {}

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              // false positive
              // oxlint-disable-next-line typescript/promise-function-async
              render={({ location: locationProps }) => {
                location = locationProps
                return children
              }}
            />
          </MemoryRouter>
        ),
      },
    )

    act(() => {
      result.current.navigate({ pathname: '/target', hash: '#section' })
    })

    assert.exists(location)
    expect(location.hash).toBe('#section')
  })

  it('navigate with replace=true uses history.replace', () => {
    let location: Partial<Location> = {}

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              // false positive
              // oxlint-disable-next-line typescript/promise-function-async
              render={({ location: locationProps }) => {
                location = locationProps
                return children
              }}
            />
          </MemoryRouter>
        ),
      },
    )

    act(() => {
      result.current.navigate('/target', { replace: true })
    })

    assert.exists(location)
    expect(location.pathname).toBe('/target')
  })

  it('navigate with replace=false uses history.push', () => {
    let location: Partial<Location> = {}

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              // false positive
              // oxlint-disable-next-line typescript/promise-function-async
              render={({ location: locationProps }) => {
                location = locationProps
                return children
              }}
            />
          </MemoryRouter>
        ),
      },
    )

    act(() => {
      result.current.navigate('/target', { replace: false })
    })

    assert.exists(location)
    expect(location.pathname).toBe('/target')
  })

  it('navigate with state option', () => {
    let location: Partial<Location> = {}

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              // false positive
              // oxlint-disable-next-line typescript/promise-function-async
              render={({ location: locationProps }) => {
                location = locationProps
                return children
              }}
            />
          </MemoryRouter>
        ),
      },
    )

    act(() => {
      result.current.navigate('/target', { state: { key: 'value' } })
    })

    assert.exists(location)
    expect(location.state).toStrictEqual({ key: 'value' })
  })

  it('navigate with replace and state', () => {
    let location: Partial<Location> = {}

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              // false positive
              // oxlint-disable-next-line typescript/promise-function-async
              render={({ location: locationProps }) => {
                location = locationProps
                return children
              }}
            />
          </MemoryRouter>
        ),
      },
    )

    act(() => {
      result.current.navigate('/target', { replace: true, state: { replaced: true } })
    })

    assert.exists(location)
    expect(location.pathname).toBe('/target')
    expect(location.state).toStrictEqual({ replaced: true })
  })
})
