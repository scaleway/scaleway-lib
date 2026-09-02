import { describe, expect, expectTypeOf, it } from 'vitest'
import { convertUnit } from '../convertUnit'

describe('convertUnit types', () => {
  it('should accept negative units with base 10', () => {
    expectTypeOf(convertUnit(1, { from: 'milli', to: 'unit', base: 10 })).toEqualTypeOf<number>()
    expectTypeOf(convertUnit(1, { from: 'micro', to: 'nano', base: 10 })).toEqualTypeOf<number>()
    expectTypeOf(convertUnit(1, { from: 'yocto', base: 10 })).toEqualTypeOf<number>()
  })

  it('should accept negative units when base is omitted (defaults to 10)', () => {
    expectTypeOf(convertUnit(1, { from: 'milli', to: 'unit' })).toEqualTypeOf<number>()
  })

  it('should accept positive units with base 2', () => {
    expectTypeOf(convertUnit(1, { from: 'kilo', to: 'mega', base: 2 })).toEqualTypeOf<number>()
    expectTypeOf(convertUnit(1, { to: 'unit', base: 2 })).toEqualTypeOf<number>()
  })

  it('should reject negative units with base 2', () => {
    // @ts-expect-error negative units are not supported with IEC/base 2
    convertUnit(1, { from: 'milli', base: 2 })
    // @ts-expect-error negative units are not supported with IEC/base 2
    convertUnit(1, { to: 'micro', base: 2 })
    // @ts-expect-error negative units are not supported with IEC/base 2
    convertUnit(1, { from: 'kilo', to: 'nano', base: 2 })

    expect.hasAssertions()
  })

  it('should expose unit as a union of all prefixes', () => {
    expectTypeOf<Parameters<typeof convertUnit>[1]['from']>().not.toEqualTypeOf<string>()
  })
})
