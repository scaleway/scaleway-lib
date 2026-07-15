import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Location } from '../index'
import { MemoryRouter, Route, useLocation, useNavigate } from '../index'

describe('useNavigate', () => {
  it('returns navigate function', () => {
    const { result } = renderHook(() => useNavigate(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    })

    expect(typeof result.current).toBe('function')
  })

  it('navigate with string path', () => {
    let location: Location

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              render={props => {
                location = props.location
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

    expect(location!.pathname).toBe('/target')
  })

  it('navigate with object', () => {
    let location: Location

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              render={props => {
                location = props.location
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

    expect(location!.pathname).toBe('/target')
    expect(location!.search).toBe('?foo=bar')
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
    let location: Location

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              render={props => {
                location = props.location
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

    expect(location!.state).toEqual({ from: 'home' })
  })

  it('navigate with hash', () => {
    let location: Location

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              render={props => {
                location = props.location
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

    expect(location!.hash).toBe('#section')
  })

  it('navigate with replace=true uses history.replace', () => {
    let location: Location

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              render={props => {
                location = props.location
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

    expect(location!.pathname).toBe('/target')
  })

  it('navigate with replace=false uses history.push', () => {
    let location: Location

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              render={props => {
                location = props.location
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

    expect(location!.pathname).toBe('/target')
  })

  it('navigate with state option', () => {
    let location: Location

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              render={props => {
                location = props.location
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

    expect(location!.state).toEqual({ key: 'value' })
  })

  it('navigate with replace and state', () => {
    let location: Location

    const { result } = renderHook(
      () => {
        const navigate = useNavigate()
        return { navigate }
      },
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/initial']}>
            <Route
              render={props => {
                location = props.location
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

    expect(location!.pathname).toBe('/target')
    expect(location!.state).toEqual({ replaced: true })
  })
})
