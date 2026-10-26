import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { useVisualPersistence } from '../'

describe('usevisualpersistence', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should work', async () => {
    const key = 'key.example'

    const { result, act } = await renderHook(() => useVisualPersistence(key))
    expect(result.current.isHidden).toBe(false)
    await act(() => {
      result.current.hide()
    })
    expect(result.current.isHidden).toBe(true)
    expect(localStorage.getItem(`visualPersistency.${key}`)).toBe('true')
  })

  it('should handle initialvalue and restore', async () => {
    const key = 'key.example'
    localStorage.setItem(`visualPersistency.${key}`, 'true')

    const { result, act } = await renderHook(() => useVisualPersistence(key))

    expect(result.current.isHidden).toBe(true)
    await act(() => {
      result.current.restore()
    })
    expect(localStorage.getItem(`visualPersistency.${key}`)).toBe('false')
    expect(result.current.isHidden).toBe(false)
  })

  it('should work without prefix', async () => {
    const key = 'key.example'

    const { result, act } = await renderHook(() =>
      useVisualPersistence(key, {
        usePrefix: false,
      }),
    )
    expect(result.current.isHidden).toBe(false)
    await act(() => {
      result.current.hide()
    })
    expect(result.current.isHidden).toBe(true)
    expect(localStorage.getItem(key)).toBe('true')
  })
})
