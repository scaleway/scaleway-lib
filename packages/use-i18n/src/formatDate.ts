import formatters from './formatters'

const formatOptions = {
  // Expected output format: February 13, 2020, 4:28 PM
  hour: {
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'long',
    year: 'numeric',
  } as const,
  hourOnly: {
    // Expected output format: 4:28 PM
    hour: 'numeric',
    minute: 'numeric',
  } as const,
  long: {
    // Expected output format: February 13, 2020
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  } as const,
  second: {
    // Expected output format: 13 February 2025 at 4:28:00
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'long',
    second: 'numeric',
    year: 'numeric',
  } as const,
  short: {
    // Expected output format: Feb 13, 2020
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  } as const,
  shortWithoutDay: {
    // Expected output format: Feb 2020
    month: 'short',
    year: 'numeric',
  } as const,
} as const

// Formats in the date local timezone, like date-fns formatISO did
const toISODate = (date: Date) => {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Invalid time value')
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const complexFormatOptions = {
  // Expected output format: 2020-02-13
  numeric: (date: Date): string => toISODate(date),
  // Expected output format: 2020-02-13 4:28 PM
  numericHour: (date: Date, locale: string): string =>
    `${toISODate(date)} ${formatters.getDateTimeFormat(locale, formatOptions.hourOnly).format(date)}`,
} as const

type FormatOptions = keyof typeof formatOptions
type ComplexFormatOptions = keyof typeof complexFormatOptions

const isFormatOption = (format: string): format is FormatOptions => format in formatOptions
const isComplexFormatOption = (format: string): format is ComplexFormatOptions => format in complexFormatOptions

const keyFormatOptions = Object.keys(formatOptions).filter(isFormatOption)
const keyComplexFormatOptions = Object.keys(complexFormatOptions).filter(isComplexFormatOption)

export const supportedFormats: (FormatOptions | ComplexFormatOptions)[] = [
  ...new Set([...keyFormatOptions, ...keyComplexFormatOptions]),
] as const

export type FormatDateOptions =
  | keyof typeof formatOptions
  | keyof typeof complexFormatOptions
  | Intl.DateTimeFormatOptions

const formatDate = (locale: string, date: Date | number | string, format: FormatDateOptions = 'short'): string => {
  if (typeof format === 'string' && !(format in formatOptions || format in complexFormatOptions)) {
    throw new Error(
      `format "${format}" should be one of ${supportedFormats.join(
        ', ',
      )} or a valid Intl.DateTimeFormat options object`,
    )
  }

  const properDate: Date = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date

  // Invalid dates format as an empty string, like formatDuration's non-finite inputs,
  // instead of throwing a RangeError in both the Intl and the numeric formats
  if (properDate instanceof Date && Number.isNaN(properDate.getTime())) {
    return ''
  }

  if (typeof format === 'string' && isComplexFormatOption(format)) {
    return complexFormatOptions[format](properDate, locale)
  }

  const options = typeof format === 'string' && isFormatOption(format) ? formatOptions[format] : format

  if (properDate instanceof Date) {
    return formatters.getDateTimeFormat(locale, options).format(properDate)
  }

  return properDate
}

export default formatDate
