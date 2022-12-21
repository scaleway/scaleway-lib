import type { FormatUnitOptions } from '../formatUnit'
import formatUnit, { supportedUnits } from '../formatUnit'

const locales = ['en', 'fr', 'ro']

type TestType = [string, FormatUnitOptions, string, number]

const tests: TestType[] = [
  ...(Object.keys(supportedUnits).map(unit => [
    'should work with',
    { unit },
    'fr',
    12.56,
  ]) as TestType[]),
  ...(Object.keys(supportedUnits)
    .map(unit =>
      locales.map(locale => [
        `should work with locale ${locale} and`,
        { unit },
        locale,
        12.56,
      ]),
    )
    .flat() as TestType[]),
  ...(Object.keys(supportedUnits)
    .map(unit =>
      locales.map(locale => [
        `should work with long format, locale ${locale} and`,
        { short: false, unit },
        locale,
        12.56,
      ]),
    )
    .flat() as TestType[]),
  ...(Object.keys(supportedUnits).map(unit => [
    'should work with maximumFractionDigits',
    { maximumFractionDigits: 3, unit },
    'fr',
    12.56,
  ]) as TestType[]),
  ...(Object.keys(supportedUnits).map(unit => [
    'should work with minimumFractionDigits',
    { minimumFractionDigits: 3, unit },
    'fr',
    12,
  ]) as TestType[]),
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
