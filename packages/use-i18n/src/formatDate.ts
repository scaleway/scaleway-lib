import { formatISO, intlFormat } from 'date-fns'

const formatOptions = {
  hour: {
    // Expected output format: February 13, 2020, 4:28 PM
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

const complexFormatOptions = {
  // Expected output format: 2020-02-13
  numeric: (date: Date): string => formatISO(date, { representation: 'date' }),
  // Expected output format: 2020-02-13 4:28 PM
  numericHour: (date: Date, locale: string): string =>
    `${formatISO(date, { representation: 'date' })} ${intlFormat(
      date,
      formatOptions.hourOnly,
      {
        locale,
      },
    )}`,
} as const

type FormatOptions = keyof typeof formatOptions
type ComplexFormatOptions = keyof typeof complexFormatOptions

const keyFormatOptions = Object.keys(formatOptions) as FormatOptions[]
const keyComplexFormatOptions = Object.keys(
  complexFormatOptions,
) as ComplexFormatOptions[]

export const supportedFormats: (FormatOptions | ComplexFormatOptions)[] = [
  ...new Set([...keyFormatOptions, ...keyComplexFormatOptions]),
] as const

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
    !(format in formatOptions || format in complexFormatOptions)
  ) {
    throw new Error(
      `format "${format}" should be one of ${supportedFormats.join(
        ', ',
      )} or a valid Intl.DateTimeFormat options object`,
    )
  }

  const properDate: Date =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date

  if (typeof format === 'string' && format in complexFormatOptions) {
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
