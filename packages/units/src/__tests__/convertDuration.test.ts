import { describe, expect, it } from 'vitest'
import { convertDuration } from '../convertDuration'

describe('convertDuration', () => {
  it.each([
    {
      desc: '',
      amount: 1,
      options: { from: 'days', to: 'hours' },
      expectResult: 24,
    },
    {
      desc: '',
      amount: 365,
      options: { from: 'days', to: 'years' },
      expectResult: 1,
    },
    {
      desc: '',
      amount: 1,
      options: { from: 'months', to: 'hours' },
      expectResult: 730,
    },
    {
      desc: 'with implicit to',
      amount: 1,
      options: { from: 'minutes' },
      expectResult: 60,
    },
    {
      desc: 'with implicit from',
      amount: 60,
      options: { to: 'minutes' },
      expectResult: 1,
    },
  ] as const)('should work $desc', ({ amount, options, expectResult }) => {
    expect.hasAssertions()
    expect(convertDuration(amount, options)).toBe(expectResult)
  })
})
