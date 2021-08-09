import filesize from 'filesize'
import formatters from './formatters'

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
]

type Exponent = typeof exponents[number]
type ExponentName = '' | 'kilo' | 'mega' | 'giga' | 'tera' | 'peta' | 'exa' | 'zetta' | 'yotta'

const frOctet = {
  plural: 'octets',
  singular: 'octet',
}

const localesWhoFavorOctetOverByte = {
  fr: frOctet,
  'fr-ca': frOctet,
  'fr-fr': frOctet,
  ro: {
    plural: 'octeți',
    singular: 'octet',
  },
}

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

const formatShortUnit = (locale: string, exponent: Exponent, unit: Unit, compoundUnit?: CompoundUnit) => {
  let shortenedUnit = symbols.short[unit]

  if (
    unit === 'byte' &&
    Object.keys(localesWhoFavorOctetOverByte).includes(locale)
  ) {
    shortenedUnit = symbols.short.octet
  }

  return `${exponent.symbol}${shortenedUnit}${
    compoundUnit ? compoundUnitsSymbols[compoundUnit] : ''
  }`
}

const formatLongUnit = (locale: string, exponent: Exponent, unit: Unit, amount: number) => {
  let translation = symbols.long[unit]

  if (
    unit === 'byte' &&
    Object.keys(localesWhoFavorOctetOverByte).includes(locale)
  ) {
    translation = localesWhoFavorOctetOverByte[locale as keyof typeof localesWhoFavorOctetOverByte]
  }

  return `${exponent.name}${formatters.getTranslationFormat(
    `{amount, plural,
      =0 {${translation.singular}}
      =1 {${translation.singular}}
      other {${translation.plural}}
  }`,
    locale,
  ).format({ amount }) as string}`
}

const format =
  ({ compoundUnit, exponent, unit, humanize = false }: {
    compoundUnit?: CompoundUnit,
    unit: Unit,
    exponent?: Exponent,
    humanize?: boolean,
  }) =>
  (
    locale: string,
    amount: number,
    { maximumFractionDigits, minimumFractionDigits, short = true }: { maximumFractionDigits?: number, minimumFractionDigits?: number, short?: boolean },
  ): string => {
    let computedExponent = exponent
    let computedValue = amount

    if (humanize) {
      if (computedExponent) {
        const value = filesize(amount, {
          base: 10,
          exponent: exponents.findIndex(
            exp => exp.name === (computedExponent as Exponent).name,
          ),
          output: 'object',
          round: maximumFractionDigits,
        }) as unknown as { value: number, symbol: string, exponent: number }
        computedValue = value.value
      } else {
        const value = filesize(amount, {
          base: 10,
          output: 'object',
          round: maximumFractionDigits,
        }) as unknown as { value: number, symbol: string, exponent: number }
        computedExponent = exponents[value.exponent]
        computedValue = value.value
      }
    }

    return `${new Intl.NumberFormat(locale, {
      maximumFractionDigits,
      minimumFractionDigits,
    }).format(computedValue)} ${
      short
        ? formatShortUnit(locale, computedExponent as Exponent, unit, compoundUnit)
        : formatLongUnit(
            locale,
            computedExponent as Exponent,
            unit,
            computedValue,
          )
    }`
  }

type SimpleUnits = `${ExponentName}${Unit}${'-humanized' | ''}`
type ComplexUnits = `${Unit}${'s' | ''}${'-humanized' | ''}`
type PerSecondUnit = `bit${'s' | ''}${'-per-second' | ''}${'-humanized' | ''}`
type SupportedUnits = SimpleUnits | ComplexUnits | PerSecondUnit

export const supportedUnits: Partial<Record<SupportedUnits, ReturnType<typeof format>>> = {
  // bits
  'bits-humanized': format({ humanize: true, unit: 'bit' }),
  'bits-per-second-humanized': format({
    compoundUnit: 'second',
    humanize: true,
    unit: 'bit',
  }),
  ...exponents.reduce(
    (acc, exponent) => ({
      ...acc,
      [`${exponent.name}bit`]: format({ exponent, unit: 'bit' }),
      [`${exponent.name}bit-per-second`]: format({
        compoundUnit: 'second',
        exponent,
        unit: 'bit',
      }),
      [`${exponent.name}bit-humanized`]: format({
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
    }),
    {},
  ),

  // bytes
  'bytes-humanized': format({ humanize: true, unit: 'byte' }),
  ...exponents.reduce(
    (acc, exponent) => ({
      ...acc,
      [`${exponent.name}byte`]: format({ exponent, unit: 'byte' }),
      [`${exponent.name}byte-humanized`]: format({
        exponent,
        humanize: true,
        unit: 'byte',
      }),
    }),
    {},
  ),
}

export interface FormatUnitOptions {
  unit: SupportedUnits
  short?: boolean
}

const formatUnit = (locale: string, number: number, { unit, ...options }: FormatUnitOptions): string =>
  supportedUnits?.[unit]?.(locale, number, options) ?? ''

export default formatUnit
