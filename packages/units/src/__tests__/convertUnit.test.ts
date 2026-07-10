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
  ] as const)('should work $desc', ({ amount, options, expectResult }) => {
    expect.hasAssertions()
    expect(convertUnit(amount, options)).toBe(expectResult)
  })
})
