import filesize from 'filesize'

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

const formatShortUnit = (locale, exponent, unit, compoundUnit) => {
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

const formatLongUnit = (locale, exponent, unit, number, messageFormat) => {
  let translation = symbols.long[unit]

  if (
    unit === 'byte' &&
    Object.keys(localesWhoFavorOctetOverByte).includes(locale)
  ) {
    translation = localesWhoFavorOctetOverByte[locale]
  }

  return `${exponent.name}${messageFormat(
    `{amount, plural,
      =0 {${translation.singular}}
      =1 {${translation.singular}}
      other {${translation.plural}}
  }`,
    locale,
  ).format({ amount: number })}`
}

const format =
  ({ compoundUnit, exponent, unit, humanize = false }) =>
  (
    locale,
    number,
    { maximumFractionDigits, minimumFractionDigits, short = true },
    messageFormat,
  ) => {
    let computedExponent = exponent
    let computedValue = number

    if (humanize) {
      if (!exponent) {
        const value = filesize(number, {
          base: 10,
          output: 'object',
          round: maximumFractionDigits,
        })
        computedExponent = exponents[value.exponent]
        computedValue = value.value
      } else {
        const value = filesize(number, {
          base: 10,
          exponent: exponents.findIndex(
            exp => exp.name === computedExponent.name,
          ),
          output: 'object',
          round: maximumFractionDigits,
        })
        computedValue = value.value
      }
    }

    return `${new Intl.NumberFormat(locale, {
      maximumFractionDigits,
      minimumFractionDigits,
    }).format(computedValue)} ${
      short
        ? formatShortUnit(locale, computedExponent, unit, compoundUnit)
        : formatLongUnit(
            locale,
            computedExponent,
            unit,
            computedValue,
            messageFormat,
          )
    }`
  }

export const supportedUnits = {
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

const formatUnit = (locale, number, { unit, ...options }, messageFormat) =>
  supportedUnits?.[unit]?.(locale, number, options, messageFormat) ?? ''

export default formatUnit
