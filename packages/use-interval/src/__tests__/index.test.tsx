import { renderHook } from '@testing-library/react'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
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

  it('with a delay of 100 ms', () => {
    const callback = vi.fn()
    renderHook(() => {
      useInterval(callback, 100)
    })
    vi.advanceTimersByTime(300)
    expect(setInterval).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledTimes(3)
  })
})
