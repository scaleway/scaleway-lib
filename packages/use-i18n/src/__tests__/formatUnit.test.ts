import { describe, expect, it } from 'vitest'
import type { FormatUnitOptions } from '../formatUnit'
import formatUnit, { supportedUnits } from '../formatUnit'

const patchIntl = (name: 'NumberFormat' | 'Locale', impl: unknown) =>
  Object.defineProperty(Intl, name, { configurable: true, value: impl, writable: true })

const locales = ['en', 'fr', 'ro']

type TestType = [string, FormatUnitOptions, string, number]

const isSupportedUnit = (unit: string): unit is FormatUnitOptions['unit'] => unit in supportedUnits

const SUPPORTED_UNITS = Object.keys(supportedUnits).filter(isSupportedUnit)

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

  describe('Intl construction caching', () => {
    it('should construct Intl.NumberFormat and Intl.Locale once per distinct input', () => {
      let numberFormatConstructions = 0
      let localeConstructions = 0

      class CountingNumberFormat extends Intl.NumberFormat {
        public constructor(...args: ConstructorParameters<typeof Intl.NumberFormat>) {
          super(...args)
          numberFormatConstructions += 1
        }
      }

      class CountingLocale extends Intl.Locale {
        public constructor(...args: ConstructorParameters<typeof Intl.Locale>) {
          super(...args)
          localeConstructions += 1
        }
      }

      patchIntl('NumberFormat', CountingNumberFormat)
      patchIntl('Locale', CountingLocale)
      try {
        // fresh locale and options, untouched by the table tests above, so the
        // module cache starts cold and every construction is attributable here
        const runBatch = () => {
          numberFormatConstructions = 0
          localeConstructions = 0
          for (let i = 0; i < 50; i++) {
            formatUnit('de', 1536, { maximumFractionDigits: 7, unit: 'byte' })
            formatUnit('de', 1536, { maximumFractionDigits: 7, short: false, unit: 'byte' })
          }
        }

        runBatch()
        // guards against the patch not being in the call path at all
        expect(numberFormatConstructions).toBeGreaterThan(0)
        expect(localeConstructions).toBeGreaterThan(0)

        runBatch()
        // repeated inputs must never construct again, in either path
        expect(numberFormatConstructions).toBe(0)
        expect(localeConstructions).toBe(0)
      } finally {
        patchIntl('NumberFormat', Intl.NumberFormat)
        patchIntl('Locale', Intl.Locale)
      }
    })
  })
})
