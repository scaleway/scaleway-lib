import memoizeIntlConstructor from 'intl-format-cache'
import IntlTranslationFormat from 'intl-messageformat'
import formatUnit, { supportedUnits } from '../formatUnit'

const locales = ['en', 'fr', 'ro']

console.log(Object.keys(supportedUnits))

const getTranslationFormat = memoizeIntlConstructor(IntlTranslationFormat)

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
    'should work with large values',
    { unit },
    'fr',
    13876876883167813487687341,
  ]),
]

describe('formatUnit', () => {
  test('should return empty string for unknown unit', () => {
    expect(
      formatUnit('fr', 123, { unit: 'unknown' }, getTranslationFormat),
    ).toMatchSnapshot()
  })

  test.each(tests)('%s %o', (_, options, locale, amount) => {
    expect(
      formatUnit(locale, amount, options, getTranslationFormat),
    ).toMatchSnapshot()
  })
})
