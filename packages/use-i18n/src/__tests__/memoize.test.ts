import { describe, expect, it, vi } from 'vitest'
import { memoize } from '../memoize'

describe(memoize, () => {
  it('should return the same value without calling again for repeated arguments', () => {
    const fn = vi.fn<(locale: string) => { locale: string }>(locale => ({ locale }))
    const memoized = memoize(fn)

    const first = memoized('en')
    const second = memoized('en')

    expect(second).toBe(first)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should call the function again for different arguments', () => {
    const fn = vi.fn<(locale: string) => { locale: string }>(locale => ({ locale }))
    const memoized = memoize(fn)

    expect(memoized('en')).not.toBe(memoized('fr'))
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should hit the cache for distinct but equal object arguments', () => {
    const fn = vi.fn<(locale: string, options: { style: string }) => { locale: string; options: { style: string } }>(
      (locale, options) => ({ locale, options }),
    )
    const memoized = memoize(fn)

    const first = memoized('en', { style: 'short' })
    const second = memoized('en', { style: 'short' })

    expect(second).toBe(first)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
