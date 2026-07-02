// oxlint-disable vitest/require-top-level-describe vitest/prefer-expect-assertions typescript/no-unsafe-assignment typescript/no-unsafe-argument typescript/no-unsafe-type-assertion typescript/no-explicit-any typescript/unbound-method
import { act, renderHook } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { MemoryRouter, Route, useLinkProps } from '../index'

test('returns href from history.createHref', () => {
  const { result } = renderHook(() => useLinkProps('/target'), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/initial']}>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(result.current[0].href).toBe('/target')
})

test('returns onClick handler', () => {
  const { result } = renderHook(() => useLinkProps('/target'), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  expect(typeof result.current[0].onClick).toBe('function')
})

test('onClick navigates with push by default', () => {
  let navigateCalled = false

  const { result } = renderHook(() => useLinkProps('/target', {}), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/initial']}>
        <Route
          render={({ history }) => {
            // oxlint-disable-next-line typescript/unbound-method
            const originalPush = history.push
            history.push = (...args: Parameters<typeof originalPush>) => {
              navigateCalled = true
              return originalPush.call(history, ...args)
            }
            return children
          }}
        />
      </MemoryRouter>
    ),
  })

  act(() => {
    result.current[0].onClick?.({
      preventDefault: vi.fn<() => void>(),
      button: 0,
      defaultPrevented: false,
    } as any)
  })

  expect(navigateCalled).toBe(true)
})

test('onClick navigates with replace when replace=true', () => {
  let replaceCalled = false

  const { result } = renderHook(() => useLinkProps('/target', {}, { replace: true }), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/initial']}>
        <Route
          render={({ history }) => {
            // oxlint-disable-next-line typescript/unbound-method
            const originalReplace = history.replace
            history.replace = (...args: Parameters<typeof originalReplace>) => {
              replaceCalled = true
              return originalReplace.call(history, ...args)
            }
            return children
          }}
        />
      </MemoryRouter>
    ),
  })

  act(() => {
    result.current[0].onClick?.({
      preventDefault: vi.fn<() => void>(),
      button: 0,
      defaultPrevented: false,
    } as any)
  })

  expect(replaceCalled).toBe(true)
})

test('onClick prevents default on left click', () => {
  const { result } = renderHook(() => useLinkProps('/target', {}), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  const preventDefault = vi.fn<() => void>()
  act(() => {
    result.current[0].onClick?.({
      preventDefault,
      button: 0,
      defaultPrevented: false,
    } as any)
  })

  expect(preventDefault).toHaveBeenCalled()
})

test('onClick does not prevent default on non-left click', () => {
  const { result } = renderHook(() => useLinkProps('/target', {}), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  const preventDefault = vi.fn<() => void>()
  act(() => {
    result.current[0].onClick?.({
      preventDefault,
      button: 1,
      defaultPrevented: false,
    } as any)
  })

  expect(preventDefault).not.toHaveBeenCalled()
})

test('onClick does not prevent default with modifier keys', () => {
  const { result } = renderHook(() => useLinkProps('/target', {}), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  const preventDefault = vi.fn<() => void>()
  act(() => {
    result.current[0].onClick?.({
      preventDefault,
      button: 0,
      defaultPrevented: false,
      ctrlKey: true,
    } as any)
  })

  expect(preventDefault).not.toHaveBeenCalled()
})

test('onClick does not prevent default with target="_blank"', () => {
  const { result } = renderHook(() => useLinkProps('/target', { target: '_blank' }), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  const preventDefault = vi.fn<() => void>()
  act(() => {
    result.current[0].onClick?.({
      preventDefault,
      button: 0,
      defaultPrevented: false,
    } as any)
  })

  expect(preventDefault).not.toHaveBeenCalled()
})

test('integrates with onClickProp', () => {
  const customOnClick = vi.fn<() => void>()

  const { result } = renderHook(() => useLinkProps('/target', { onClick: customOnClick }), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  const event = {
    preventDefault: vi.fn<() => void>(),
    button: 0,
    defaultPrevented: false,
  } as any

  act(() => {
    result.current[0].onClick?.(event)
  })

  expect(customOnClick).toHaveBeenCalledWith(event)
})

test('handles onClickProp errors', () => {
  const customOnClick = vi.fn<() => void>(() => {
    throw new Error('Custom error')
  })

  const { result } = renderHook(() => useLinkProps('/target', { onClick: customOnClick }), {
    wrapper: ({ children }) => (
      <MemoryRouter>
        <Route>{children}</Route>
      </MemoryRouter>
    ),
  })

  const event = {
    preventDefault: vi.fn<() => void>(),
    button: 0,
    defaultPrevented: false,
  }

  expect(() => {
    result.current[0].onClick?.(event as any)
  }).toThrow('Custom error')

  expect(event.preventDefault).toHaveBeenCalled()
})

test('passes through other props', () => {
  const { result } = renderHook(
    () =>
      useLinkProps('/target', {
        className: 'custom-class',
        id: 'custom-id',
        title: 'Custom title',
      }),
    {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <Route>{children}</Route>
        </MemoryRouter>
      ),
    },
  )

  expect(result.current[0].className).toBe('custom-class')
  expect(result.current[0].id).toBe('custom-id')
  expect(result.current[0].title).toBe('Custom title')
})

test('uses replace when navigating to same location (duplicate navigation)', () => {
  let replaceCalled = false
  let pushCalled = false

  const { result } = renderHook(() => useLinkProps('/current', {}), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/current']}>
        <Route
          render={({ history }) => {
            const originalReplace = history.replace
            const originalPush = history.push
            history.replace = (...args: Parameters<typeof originalReplace>) => {
              replaceCalled = true
              return originalReplace.call(history, ...args)
            }
            history.push = (...args: Parameters<typeof originalPush>) => {
              pushCalled = true
              return originalPush.call(history, ...args)
            }
            return children
          }}
        />
      </MemoryRouter>
    ),
  })

  act(() => {
    result.current[0].onClick?.({
      preventDefault: vi.fn<() => void>(),
      button: 0,
      defaultPrevented: false,
    } as any)
  })

  expect(replaceCalled).toBe(true)
  expect(pushCalled).toBe(false)
})

test('uses replace when navigating to same location with search', () => {
  let replaceCalled = false

  const { result } = renderHook(() => useLinkProps({ pathname: '/current', search: '?foo=bar' }, {}), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/current?foo=bar']}>
        <Route
          render={({ history }) => {
            const originalReplace = history.replace
            history.replace = (...args: Parameters<typeof originalReplace>) => {
              replaceCalled = true
              return originalReplace.call(history, ...args)
            }
            return children
          }}
        />
      </MemoryRouter>
    ),
  })

  act(() => {
    result.current[0].onClick?.({
      preventDefault: vi.fn<() => void>(),
      button: 0,
      defaultPrevented: false,
    } as any)
  })

  expect(replaceCalled).toBe(true)
})

test('uses push when navigating to different location even with replace=false', () => {
  let pushCalled = false

  const { result } = renderHook(() => useLinkProps('/different', {}), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/current']}>
        <Route
          render={({ history }) => {
            const originalPush = history.push
            history.push = (...args: Parameters<typeof originalPush>) => {
              pushCalled = true
              return originalPush.call(history, ...args)
            }
            return children
          }}
        />
      </MemoryRouter>
    ),
  })

  act(() => {
    result.current[0].onClick?.({
      preventDefault: vi.fn<() => void>(),
      button: 0,
      defaultPrevented: false,
    } as any)
  })

  expect(pushCalled).toBe(true)
})

test('respects replace option even for duplicate navigation', () => {
  let replaceCalled = false

  const { result } = renderHook(() => useLinkProps('/current', {}, { replace: true }), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={['/current']}>
        <Route
          render={({ history }) => {
            const originalReplace = history.replace
            history.replace = (...args: Parameters<typeof originalReplace>) => {
              replaceCalled = true
              return originalReplace.call(history, ...args)
            }
            return children
          }}
        />
      </MemoryRouter>
    ),
  })

  act(() => {
    result.current[0].onClick?.({
      preventDefault: vi.fn<() => void>(),
      button: 0,
      defaultPrevented: false,
    } as any)
  })

  expect(replaceCalled).toBe(true)
})
