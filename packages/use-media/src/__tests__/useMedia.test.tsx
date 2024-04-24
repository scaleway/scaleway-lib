import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useMedia } from '..'

describe('useMedia hook', () => {
  it('should return the result of a query with a string', () => {
    const { result } = renderHook(() =>
      useMedia('screen and (min-width: 1000px)'),
    )

    expect(result.current).toBe(false)
  })

  it('should call onChange', () => {
    const mockAddEventListener = (_event: string, callback: () => void) =>
      callback()

    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation((query: string) => ({
        addEventListener: mockAddEventListener,
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
      writable: true,
    })

    const { result } = renderHook(() =>
      useMedia('screen and (min-width: 1000px)'),
    )

    expect(result.current).toBe(false)
  })

  it('should not call onChange when unmounted', () => {
    let callback: () => void

    const mockAddEventListener = (_event: string, callbackFn: () => void) => {
      callback = callbackFn
    }

    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation((query: string) => ({
        addEventListener: mockAddEventListener,
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
      writable: true,
    })

    const { result, unmount } = renderHook(() =>
      useMedia('screen and (min-width: 1000px)'),
    )

    unmount()
    // @ts-expect-error variable is assigned inside mockAddEventListener
    callback()

    expect(result.current).toBe(false)
  })
})
