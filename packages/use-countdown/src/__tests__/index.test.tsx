import { describe, expect, it, vi } from 'vitest'
import { render, renderHook } from 'vitest-browser-react'
import { useCountdown } from '../'

const Countdown = ({ duration, start = false }: { duration: number; start?: boolean }) => {
  const { startCountdown, timeLeft } = useCountdown({ duration, start })

  return (
    <>
      <p>{timeLeft}</p>
      <button type="button" onClick={startCountdown}>
        start
      </button>
    </>
  )
}

describe(useCountdown, () => {
  it('should initialize with the provided duration', async () => {
    const { result } = await renderHook(() => useCountdown({ duration: 5 }))

    expect(result.current.timeLeft).toBe(5)
  })

  it('should start countdown when startcountdown is called', async () => {
    vi.useFakeTimers()
    const { result, act } = await renderHook(() => useCountdown({ duration: 5, start: false }))

    await act(() => {
      result.current.startCountdown()
    })

    expect(result.current.timeLeft).toBe(5)

    await act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.timeLeft).toBe(4)
    vi.useRealTimers()
  })

  it('should decrement time every second when started', async () => {
    vi.useFakeTimers()
    const { result, act } = await renderHook(() => useCountdown({ duration: 5, start: true }))

    await act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.timeLeft).toBe(4)

    await act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.timeLeft).toBe(3)
    vi.useRealTimers()
  })

  it('should stop when time reaches 0', async () => {
    vi.useFakeTimers()
    const { result, act } = await renderHook(() => useCountdown({ duration: 1, start: true }))

    await act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.timeLeft).toBe(0)

    await act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.timeLeft).toBe(0)
    vi.useRealTimers()
  })

  it('should reset to duration when startcountdown is called again', async () => {
    vi.useFakeTimers()
    const screen = await render(<Countdown duration={5} start />)

    vi.advanceTimersByTime(1000)

    await expect.element(screen.getByText('4')).toBeInTheDocument()

    await screen.getByRole('button').click()

    await expect.element(screen.getByText('5')).toBeInTheDocument()
    vi.useRealTimers()
  })
})
