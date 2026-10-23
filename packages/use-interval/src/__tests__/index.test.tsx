import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { useInterval } from '..'

describe('useinterval', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'setInterval')
  })

  afterAll(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should start with a delay of 100 ms', async () => {
    const callback = vi.fn<() => void>()
    await renderHook(() => {
      useInterval(callback, 100)
    })
    vi.advanceTimersByTime(300)
    expect(setInterval).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('should not start interval if null is passed', async () => {
    const callback = vi.fn<() => void>()
    await renderHook(() => {
      useInterval(callback, null)
    })
    vi.advanceTimersByTime(300)
    expect(setInterval).toHaveBeenCalledTimes(0)
    expect(callback).toHaveBeenCalledTimes(0)
  })
})
