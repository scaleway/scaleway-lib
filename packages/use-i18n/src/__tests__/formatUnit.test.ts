import { describe, expect, test } from 'vitest'
import type { FormatUnitOptions } from '../formatUnit'
import formatUnit, { supportedUnits } from '../formatUnit'

const locales = ['en', 'fr', 'ro']

type TestType = [string, FormatUnitOptions, string, number]

const SUPPORTED_UNITS = Object.keys(
  supportedUnits,
) as FormatUnitOptions['unit'][]

const tests: TestType[] = [
  ...SUPPORTED_UNITS.map<TestType>(unit => [
    'should work with',
    { unit },
    'fr',
    12.56,
  ]),
  ...SUPPORTED_UNITS.map(unit =>
    locales.map<TestType>(locale => [
      `should work with locale ${locale} and`,
      { unit },
      locale,
      12.56,
    ]),
  ).flat(),
  ...SUPPORTED_UNITS.map(unit =>
    locales.map<TestType>(locale => [
      `should work with long format, locale ${locale} and`,
      { short: false, unit },
      locale,
      12.56,
    ]),
  ).flat(),
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
    4294967296, // 4 GB
  ]),
]

describe('formatUnit', () => {
  test('should return empty string for unknown unit', () => {
    expect(
      // @ts-expect-error We test the use case when unit is unknown
      formatUnit('fr', 123, { unit: 'unknown' }),
    ).toMatchSnapshot()
  })

  test.each(tests)('%s %o', (_, options, locale, amount) => {
    expect(formatUnit(locale, amount, options)).toMatchSnapshot()
  })
})
