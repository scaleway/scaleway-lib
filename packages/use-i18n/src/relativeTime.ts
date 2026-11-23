import formatters from './formatters'

// Intl.RelativeTimeFormat always emits ago/in, so noSuffix formats the bare distance instead
export type RelativeTimeOptions = Intl.RelativeTimeFormatOptions & {
  noSuffix?: boolean
}

// Intl.RelativeTimeFormat.format() types its unit as a plain string, so the unit union is ours
export type RelativeTimeStrictOptions = RelativeTimeOptions & {
  unit?: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
}

// Average durations in seconds, used to pick the largest relative time unit
const relativeUnitSeconds = {
  year: 31_556_952, // 365.25 days
  month: 2_629_746, // 30.44 days
  day: 86_400,
  hour: 3600,
  minute: 60,
} as const

// Average durations in milliseconds, used by relativeTimeStrict
const relativeStrictUnitMilliseconds = {
  second: 1000,
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
  week: 604_800_000,
  month: 2_629_746_000, // 30.44 days
  quarter: 7_889_238_000, // 91.31 days
  year: 31_556_952_000, // 365.25 days
} as const

export const relativeTime = (
  locale: string,
  date: Date | number,
  { numeric = 'auto', style = 'long', localeMatcher, noSuffix }: RelativeTimeOptions = {},
): string => {
  const seconds = (new Date(date).getTime() - Date.now()) / 1000

  let unit: RelativeTimeStrictOptions['unit'] = 'second'
  let value = seconds

  for (const relativeUnit of ['year', 'month', 'day', 'hour', 'minute'] as const) {
    if (Math.abs(seconds) >= relativeUnitSeconds[relativeUnit]) {
      unit = relativeUnit
      value = seconds / relativeUnitSeconds[relativeUnit]
      break
    }
  }

  // Round the absolute distance, as date-fns did: half ties never depend on direction
  const rounded = Math.round(Math.abs(value)) * Math.sign(seconds)

  if (noSuffix) {
    return formatters.getNumberFormat(locale, { style: 'unit', unit, unitDisplay: style }).format(Math.abs(rounded))
  }

  return formatters.getRelativeTimeFormat(locale, { numeric, style, localeMatcher }).format(rounded, unit)
}

export const relativeTimeStrict = (
  locale: string,
  date: Date | number,
  { unit = 'day', numeric = 'auto', style = 'long', localeMatcher, noSuffix }: RelativeTimeStrictOptions = {},
): string => {
  const milliseconds = new Date(date).getTime() - Date.now()
  // Round the absolute distance, as date-fns did: half ties never depend on direction
  const value = Math.round(Math.abs(milliseconds / relativeStrictUnitMilliseconds[unit])) * Math.sign(milliseconds)

  if (noSuffix) {
    // quarter is not a sanctioned Intl.NumberFormat unit, so it has no unsuffixed form
    if (unit === 'quarter') {
      throw new RangeError("noSuffix is not supported with the 'quarter' unit")
    }

    return formatters.getNumberFormat(locale, { style: 'unit', unit, unitDisplay: style }).format(Math.abs(value))
  }

  return formatters.getRelativeTimeFormat(locale, { numeric, style, localeMatcher }).format(value, unit)
}
