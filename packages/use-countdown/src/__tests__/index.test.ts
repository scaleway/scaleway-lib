import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCountdown } from '../'

describe('usecountdown', () => {
  it('should initialize with the provided duration', () => {
    const { result } = renderHook(() => useCountdown({ duration: 5 }))
    expect(result.current.timeLeft).toBe(5)
  })

  it('should start countdown when startcountdown is called', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useCountdown({ duration: 5, start: false }))
    act(() => {
      result.current.startCountdown()
    })
    expect(result.current.timeLeft).toBe(5)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.timeLeft).toBe(4)
  })

  it('should decrement time every second when started', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useCountdown({ duration: 5, start: true }))
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.timeLeft).toBe(4)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.timeLeft).toBe(3)
    vi.useRealTimers()
  })

  it('should stop when time reaches 0', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useCountdown({ duration: 1, start: true }))
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.timeLeft).toBe(0)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.timeLeft).toBe(0)
    vi.useRealTimers()
  })

  it('should reset to duration when startcountdown is called again', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useCountdown({ duration: 5, start: true }))
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.timeLeft).toBe(4)
    act(() => {
      result.current.startCountdown()
    })
    expect(result.current.timeLeft).toBe(5)
    vi.useRealTimers()
  })
})
