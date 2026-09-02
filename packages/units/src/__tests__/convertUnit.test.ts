import { describe, expect, it } from 'vitest'
import { convertUnit } from '../convertUnit'

describe('convertUnit', () => {
  it.each([
    {
      desc: 'with base 10 by default and specified units',
      amount: 1000,
      options: { from: 'mega', to: 'giga' },
      expectResult: 1,
    },
    {
      desc: 'with base 2 and specified units',
      amount: 1024,
      options: { from: 'mega', to: 'giga', base: 2 },
      expectResult: 1,
    },
    {
      desc: 'with base 10 by default and implicit from',
      amount: 1500,
      options: { to: 'kilo' },
      expectResult: 1.5,
    },
    {
      desc: 'with base 10 by default and implicit to',
      amount: 1500,
      options: { from: 'kilo' },
      expectResult: 1500000,
    },
    { desc: 'in any direction', amount: 1.5, options: { from: 'giga', to: 'mega' }, expectResult: 1500 },
    { desc: 'with negative SI prefix', amount: 1000, options: { from: 'unit', to: 'milli' }, expectResult: 1000000000 },
    { desc: 'from negative SI prefix to unit', amount: 1, options: { from: 'micro', to: 'unit' }, expectResult: 1e-9 },
    { desc: 'between negative SI prefixes', amount: 1000, options: { from: 'micro', to: 'milli' }, expectResult: 1 },
    {
      desc: 'from positive to negative SI prefix',
      amount: 1,
      options: { from: 'kilo', to: 'milli' },
      expectResult: 1000000000,
    },
  ] as const)('should work $desc', ({ amount, options, expectResult }) => {
    expect.hasAssertions()
    expect(convertUnit(amount, options)).toBe(expectResult)
  })

  it('should properly return round float', () => {
    // 2800000000 * (10**-30) === 2.8000000000000004e-2
    // while 2800000000 / (10**9) properly returns 2.8
    // Welcome to javascript hell
    expect(convertUnit(2800000000, { to: 'giga' })).toBe(2.8)
  })
})
