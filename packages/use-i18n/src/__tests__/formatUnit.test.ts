import { describe, expect, it } from 'vitest'
import type { FormatUnitOptions } from '../formatUnit'
import formatUnit, { supportedUnits } from '../formatUnit'

const locales = ['en', 'fr', 'ro']

type TestType = [string, FormatUnitOptions, string, number]

const SUPPORTED_UNITS = Object.keys(supportedUnits) as FormatUnitOptions['unit'][]

const tests: TestType[] = [
  ...SUPPORTED_UNITS.map<TestType>(unit => ['should work with', { unit }, 'fr', 12.56]),
  ...SUPPORTED_UNITS.flatMap(unit =>
    locales.map<TestType>(locale => [`should work with locale ${locale} and`, { unit }, locale, 12.56]),
  ),
  ...SUPPORTED_UNITS.flatMap(unit =>
    locales.map<TestType>(locale => [
      `should work with long format, locale ${locale} and`,
      { short: false, unit },
      locale,
      12.56,
    ]),
  ),
  ...SUPPORTED_UNITS.map<TestType>(unit => [
    'should work with maximumFractionDigits',
    { maximumFractionDigits: 3, unit },
    'fr',
    12.56,
  ]),
  ...SUPPORTED_UNITS.map<TestType>(unit => [
    'should work with minimumFractionDigits',
    { minimumFractionDigits: 3, unit },
    'fr',
    12,
  ]),
  ...SUPPORTED_UNITS.map<TestType>(unit => [
    'should work with base',
    { base: 2, unit },
    'en',
    4_294_967_296, // 4 GB
  ]),
]

describe(formatUnit, () => {
  it('should return empty string for unknown unit', () => {
    expect(
      // @ts-expect-error We test the use case when unit is unknown
      formatUnit('fr', 123, { unit: 'unknown' }),
    ).toMatchSnapshot()
  })

  it.for(tests)('%s %o', ([, options, locale, amount]) => {
    expect(formatUnit(locale, amount, options)).toMatchSnapshot()
  })

  it('should use octet wording for region-tagged French locales', () => {
    expect(formatUnit('fr-FR', 12, { short: false, unit: 'byte' })).toBe('12 octets')
    expect(formatUnit('fr-FR', 12, { unit: 'byte' })).toBe('12 o')
  })

  it('should keep octet wording for language-only locales', () => {
    expect(formatUnit('fr', 12, { short: false, unit: 'byte' })).toBe('12 octets')
  })

  it('should use the plural form for zero in plural-zero languages', () => {
    expect(formatUnit('en', 0, { short: false, unit: 'byte' })).toBe('0 bytes')
    expect(formatUnit('ro', 0, { short: false, unit: 'byte' })).toBe('0 octeți')
  })

  it('should keep the singular form for zero in French', () => {
    expect(formatUnit('fr', 0, { short: false, unit: 'byte' })).toBe('0 octet')
  })
})
