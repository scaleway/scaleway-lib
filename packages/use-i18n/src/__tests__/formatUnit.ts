import formatUnit, { FormatUnitOptions, supportedUnits } from '../formatUnit'

const locales = ['en', 'fr', 'ro']

const tests = [
  ...Object.keys(supportedUnits).map(unit => [
    'should work with',
    { unit },
    'fr',
    12.56,
  ]),
  ...Object.keys(supportedUnits)
    .map(unit =>
      locales.map(locale => [
        `should work with locale ${locale} and`,
        { unit },
        locale,
        12.56,
      ]),
    )
    .flat(),
  ...Object.keys(supportedUnits)
    .map(unit =>
      locales.map(locale => [
        `should work with long format, locale ${locale} and`,
        { short: false, unit },
        locale,
        12.56,
      ]),
    )
    .flat(),
  ...Object.keys(supportedUnits).map(unit => [
    'should work with maximumFractionDigits',
    { maximumFractionDigits: 3, unit },
    'fr',
    12.56,
  ]),
  ...Object.keys(supportedUnits).map(unit => [
    'should work with minimumFractionDigits',
    { minimumFractionDigits: 3, unit },
    'fr',
    12,
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
    expect(
      formatUnit(
        locale as string,
        amount as number,
        options as FormatUnitOptions,
      ),
    ).toMatchSnapshot()
  })
})
