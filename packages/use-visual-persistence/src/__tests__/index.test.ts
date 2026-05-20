import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useVisualPersistence } from '../'

describe('usevisualpersistence', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should work', () => {
    const key = 'key.example'

    const { result } = renderHook(() => useVisualPersistence(key))
    expect(result.current.isHidden).toBe(false)
    act(() => {
      result.current.hide()
    })
    expect(result.current.isHidden).toBe(true)
    expect(localStorage.getItem(`visualPersistency.${key}`)).toBe('true')
  })

  it('should handle initialvalue and restore', () => {
    const key = 'key.example'
    localStorage.setItem(`visualPersistency.${key}`, 'true')

    const { result } = renderHook(() => useVisualPersistence(key))

    expect(result.current.isHidden).toBe(true)
    act(() => {
      result.current.restore()
    })
    expect(localStorage.getItem(`visualPersistency.${key}`)).toBe('false')
    expect(result.current.isHidden).toBe(false)
  })

  it('should work without prefix', () => {
    const key = 'key.example'

    const { result } = renderHook(() =>
      useVisualPersistence(key, {
        usePrefix: false,
      }),
    )
    expect(result.current.isHidden).toBe(false)
    act(() => {
      result.current.hide()
    })
    expect(result.current.isHidden).toBe(true)
    expect(localStorage.getItem(key)).toBe('true')
  })
})
