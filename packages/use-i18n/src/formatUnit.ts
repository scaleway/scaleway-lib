import { filesize } from 'filesize'
import formatters, { formatToString } from './formatters'
import { memoize } from './memoize'

// We are on base 10, so we should use IEC standard here ...
const exponents = [
  { name: '', symbol: '' },
  { name: 'kilo', symbol: 'K' },
  { name: 'mega', symbol: 'M' },
  { name: 'giga', symbol: 'G' },
  { name: 'tera', symbol: 'T' },
  { name: 'peta', symbol: 'P' },
  { name: 'exa', symbol: 'E' },
  { name: 'zetta', symbol: 'Z' },
  { name: 'yotta', symbol: 'Y' },
] as const

type Exponent = (typeof exponents)[number]
type ExponentName = '' | 'kilo' | 'mega' | 'giga' | 'tera' | 'peta' | 'exa' | 'zetta' | 'yotta'

const frOctet = {
  plural: 'octets',
  singular: 'octet',
}

const localesWhoFavorOctetOverByte = {
  fr: frOctet,
  ro: {
    plural: 'octeți',
    singular: 'octet',
  },
}

// CLDR: these languages use the plural form for zero ("0 bytes"), unlike French ("0 octet")
const languagesWhoUsePluralForZero = new Set(['en', 'ro'])

// 'fr-FR' and 'ro-RO' must resolve to their language, not be matched as exact strings
const getLanguage = memoize((locale: string) => new Intl.Locale(locale).language)

const symbols = {
  long: {
    bit: {
      plural: 'bits',
      singular: 'bit',
    },
    byte: {
      plural: 'bytes',
      singular: 'byte',
    },
  },
  short: {
    bit: 'b',
    byte: 'B',
    octet: 'o',
  },
}

const compoundUnitsSymbols = {
  second: 'ps',
}

type Unit = 'bit' | 'byte'
type CompoundUnit = 'second'

const isOctetLocale = (locale: string): locale is keyof typeof localesWhoFavorOctetOverByte =>
  Object.keys(localesWhoFavorOctetOverByte).includes(locale)

// oxlint-disable-next-line max-params
const formatShortUnit = (locale: string, exponent: Exponent, unit: Unit, compoundUnit?: CompoundUnit) => {
  let shortenedUnit = symbols.short[unit]

  if (unit === 'byte' && isOctetLocale(getLanguage(locale))) {
    shortenedUnit = symbols.short.octet
  }

  return `${exponent.symbol}${shortenedUnit}${compoundUnit ? compoundUnitsSymbols[compoundUnit] : ''}`
}

// oxlint-disable-next-line max-params
const formatLongUnit = (locale: string, exponent: Exponent, unit: Unit, amount: number) => {
  const language = getLanguage(locale)
  let translation = symbols.long[unit]

  if (unit === 'byte' && isOctetLocale(language)) {
    translation = localesWhoFavorOctetOverByte[language]
  }

  const formatted = formatters
    .getTranslationFormat(
      `{amount, plural,
      =0 {${languagesWhoUsePluralForZero.has(language) ? translation.plural : translation.singular}}
      =1 {${translation.singular}}
      other {${translation.plural}}
  }`,
      locale,
    )
    .format({ amount })

  return `${exponent.name}${formatToString(formatted)}`
}

const format =
  ({
    compoundUnit,
    exponent,
    unit,
    humanize = false,
  }: {
    compoundUnit?: CompoundUnit
    unit: Unit
    exponent?: Exponent
    humanize?: boolean
  }) =>
  (
    locale: string,
    amount: number,
    {
      maximumFractionDigits,
      minimumFractionDigits,
      short = true,
      base = 10,
    }: {
      maximumFractionDigits?: number
      minimumFractionDigits?: number
      short?: boolean
      base?: 2 | 10
    },
  ): string => {
    // `exponents[0]` is the identity exponent (no name, no symbol): a formatter
    // registered with neither an exponent nor humanize formats the base unit
    let computedExponent = exponent ?? exponents[0]
    let computedValue = amount

    if (humanize) {
      if (exponent) {
        const val = filesize(amount, {
          base,
          exponent: exponents.findIndex(exp => exp.name === exponent.name),
          output: 'object',
          round: maximumFractionDigits,
        })

        computedValue = Number(val.value.toString())
      } else {
        const value = filesize(amount, {
          base,
          output: 'object',
          round: maximumFractionDigits,
        })

        computedExponent = exponents[value.exponent] ?? exponents[0]
        computedValue = Number(value.value.toString())
      }
    }

    return `${formatters
      .getNumberFormat(locale, {
        maximumFractionDigits,
        minimumFractionDigits,
      })
      .format(computedValue)} ${
      short
        ? formatShortUnit(locale, computedExponent, unit, compoundUnit)
        : formatLongUnit(locale, computedExponent, unit, computedValue)
    }`
  }

type SimpleUnits = `${ExponentName}${Unit}${'-humanized' | ''}`
type ComplexUnits = `${Unit}${'s' | ''}${'-humanized' | ''}`

type PerSecondUnit = `${ExponentName | ''}${'bit' | 'byte'}${'s' | ''}${'-per-second' | ''}${'-humanized' | ''}`
type SupportedUnits = SimpleUnits | ComplexUnits | PerSecondUnit

export const supportedUnits: Partial<Record<SupportedUnits, ReturnType<typeof format>>> = {
  // singular and plural unit names are aliases: one formatter serves both,
  // generated for every exponent
  // bits
  ...exponents.reduce(
    (acc, exponent) =>
      Object.assign(acc, {
        [`${exponent.name}bit`]: format({ exponent, unit: 'bit' }),
        [`${exponent.name}bits`]: format({ exponent, unit: 'bit' }),
        [`${exponent.name}bit-per-second`]: format({
          compoundUnit: 'second',
          exponent,
          unit: 'bit',
        }),
        [`${exponent.name}bits-per-second`]: format({
          compoundUnit: 'second',
          exponent,
          unit: 'bit',
        }),
        [`${exponent.name}bit-humanized`]: format({
          exponent,
          humanize: true,
          unit: 'bit',
        }),
        [`${exponent.name}bits-humanized`]: format({
          exponent,
          humanize: true,
          unit: 'bit',
        }),
        [`${exponent.name}bit-per-second-humanized`]: format({
          compoundUnit: 'second',
          exponent,
          humanize: true,
          unit: 'bit',
        }),
        [`${exponent.name}bits-per-second-humanized`]: format({
          compoundUnit: 'second',
          exponent,
          humanize: true,
          unit: 'bit',
        }),
      }),
    {},
  ),

  // bytes
  ...exponents.reduce(
    (acc, exponent) =>
      Object.assign(acc, {
        [`${exponent.name}byte`]: format({ exponent, unit: 'byte' }),
        [`${exponent.name}bytes`]: format({ exponent, unit: 'byte' }),
        [`${exponent.name}byte-per-second`]: format({
          compoundUnit: 'second',
          exponent,
          unit: 'byte',
        }),
        [`${exponent.name}bytes-per-second`]: format({
          compoundUnit: 'second',
          exponent,
          unit: 'byte',
        }),
        [`${exponent.name}byte-humanized`]: format({
          exponent,
          humanize: true,
          unit: 'byte',
        }),
        [`${exponent.name}bytes-humanized`]: format({
          exponent,
          humanize: true,
          unit: 'byte',
        }),
        [`${exponent.name}byte-per-second-humanized`]: format({
          compoundUnit: 'second',
          exponent,
          humanize: true,
          unit: 'byte',
        }),
        [`${exponent.name}bytes-per-second-humanized`]: format({
          compoundUnit: 'second',
          exponent,
          humanize: true,
          unit: 'byte',
        }),
      }),
    {},
  ),

  // exponent-less humanized plural keys scale to the best unit instead of
  // staying on the base exponent: they must come after the spreads, which
  // register these same keys pinned to `exponents[0]`
  'bits-humanized': format({ humanize: true, unit: 'bit' }),
  'bits-per-second-humanized': format({
    compoundUnit: 'second',
    humanize: true,
    unit: 'bit',
  }),
  'bytes-humanized': format({ humanize: true, unit: 'byte' }),
  'bytes-per-second-humanized': format({
    compoundUnit: 'second',
    humanize: true,
    unit: 'byte',
  }),
}

export type FormatUnitOptions = {
  /**
   * The unit to format with — its form decides how the number is interpreted:
   * a bare name (`kilobyte`) means the number is already a count in that unit,
   * a pinned `-humanized` name (`kilobyte-humanized`) converts a raw bit/byte
   * count to that unit, and an auto `-humanized` name (`bytes-humanized`)
   * converts it to the best unit. See the README for the full list of names.
   */
  unit: SupportedUnits
  /**
   * Whether to output the short or the long form of the unit
   * (think `Kb` vs `kilobits`).
   * @default true
   */
  short?: boolean
  /** The maximum number of fraction digits to use. */
  maximumFractionDigits?: number
  /** The minimum number of fraction digits to use. */
  minimumFractionDigits?: number
  /**
   * The base the `-humanized` forms use to convert a raw bit/byte count:
   * `10` means one kilo is 1000, `2` means one kilo is 1024. Bare units never
   * convert, so they ignore this option.
   * @default 10
   */
  base?: 2 | 10
}

/**
 * Formats a number of bits or bytes with an SI unit (kilo, mega, giga, …)
 * following the IEC base-10 standard, until
 * [ECMA-402 Unit Preferences](https://github.com/tc39/proposal-smart-unit-preferences)
 * is standardised.
 *
 * The form of `unit` decides how `number` is interpreted:
 *
 * - **bare** — `formatUnit('en', 12, { unit: 'kilobyte' })` → `'12 KB'`:
 *   the number is already a count in that unit, it is labeled, never converted
 * - **pinned `-humanized`** — `formatUnit('en', 12, { unit: 'kilobyte-humanized' })` → `'0.01 KB'`:
 *   the number is a raw bit/byte count, converted to the named unit — use it
 *   when the displayed unit is fixed (a table where every row reads in the
 *   same unit) but the data is stored in bits or bytes
 * - **auto `-humanized`** — `formatUnit('en', 1234567, { unit: 'bytes-humanized' })` → `'1.23 MB'`:
 *   the number is a raw bit/byte count and the best unit is picked
 *
 * The same three forms exist as `-per-second` compounds, and every unit name
 * also exists in a plural form (`bits` ≡ `bit`).
 *
 * @param locale - a BCP 47 language tag, e.g. `en` or `fr-FR`
 * @param number - the value to format, interpreted according to `unit`
 * @param options - see {@link FormatUnitOptions}
 * @returns the formatted string, or `''` when the unit is not supported
 */
const formatUnit = (locale: string, number: number, { unit, ...options }: FormatUnitOptions): string =>
  supportedUnits[unit]?.(locale, number, options) ?? ''

export default formatUnit
