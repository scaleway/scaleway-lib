import { formatISO, intlFormat } from 'date-fns'

const formatOptions = {
  second: {
    // Expected output format: 13 February 2025 at 4:28:00
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  },
  hour: {
    // Expected output format: February 13, 2020, 4:28 PM
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'long',
    year: 'numeric',
  },
  hourOnly: {
    // Expected output format: 4:28 PM
    hour: 'numeric',
    minute: 'numeric',
  },
  long: {
    // Expected output format: February 13, 2020
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
  short: {
    // Expected output format: Feb 13, 2020
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  },
  shortWithoutDay: {
    // Expected output format: Feb 2020
    month: 'short',
    year: 'numeric',
  },
} as const

const complexFormatOptions = {
  // Expected output format: 2020-02-13
  numeric: (date: Date): string => formatISO(date, { representation: 'date' }),
  // Expected output format: 2020-02-13 4:28 PM
  numericHour: (date: Date, locale: string): string =>
    `${formatISO(date, { representation: 'date' })} ${intlFormat(
      date,
      formatOptions.hourOnly,
      { locale },
    )}`,
} as const

export const supportedFormats = [
  ...Object.keys(formatOptions),
  ...Object.keys(complexFormatOptions),
]

export type FormatDateOptions =
  | keyof typeof formatOptions
  | keyof typeof complexFormatOptions
  | Intl.DateTimeFormatOptions

const formatDate = (
  locale: string,
  date: Date | number | string,
  format: FormatDateOptions = 'short',
): string => {
  if (
    typeof format === 'string' &&
    !(`${format}` in formatOptions || `${format}` in complexFormatOptions)
  ) {
    throw new Error(
      `format "${format}" should be one of ${supportedFormats.join(
        ', ',
      )} or a valid Intl.DateTimeFormat options object`,
    )
  }

  const properDate: Date =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date

  if (typeof format === 'string' && `${format}` in complexFormatOptions) {
    return complexFormatOptions[format as keyof typeof complexFormatOptions](
      properDate,
      locale,
    )
  }

  const options =
    typeof format === 'string'
      ? formatOptions[format as keyof typeof formatOptions]
      : format

  if (properDate instanceof Date) {
    return intlFormat(properDate, options as Parameters<typeof intlFormat>[1], {
      locale,
    })
  }

  return properDate
}

export default formatDate
