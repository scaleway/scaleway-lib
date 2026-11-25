import formatters from './formatters'

export type FormatDurationOptions = 'clock' | 'clock-milliseconds' | Intl.DurationFormatOptions

const padNumberWithZeros = (num: number, targetLength = 2) => String(num).padStart(targetLength, '0')

const formatDuration = (locale: string, durationInSeconds: number, format?: FormatDurationOptions): string => {
  // Non-finite inputs format like an empty duration instead of crashing, as date-fns did
  const totalSeconds = Number.isFinite(durationInSeconds) ? Math.trunc(durationInSeconds) : 0
  // Negative durations get a leading sign. It is read before truncation so sub-second
  // negative durations keep it: -0.5s in clock-milliseconds formats as -00:00:00:500
  const sign = durationInSeconds < 0 && Number.isFinite(durationInSeconds) ? '-' : ''
  const absSeconds = Math.abs(totalSeconds)

  if (format === 'clock-milliseconds') {
    // This method has not floating point issue
    // While number % 1 has
    const parts = durationInSeconds.toString().split('.')
    const decimal = parts[1] !== undefined ? Number(`0.${parts[1]}`) : 0
    const milliseconds = decimal * 1000

    return `${sign}${padNumberWithZeros(Math.trunc(absSeconds / 3600) % 24)}:${padNumberWithZeros(
      Math.trunc(absSeconds / 60) % 60,
    )}:${padNumberWithZeros(absSeconds % 60)}:${padNumberWithZeros(milliseconds, 3)}`
  }

  if (format === 'clock') {
    return `${sign}${padNumberWithZeros(Math.trunc(absSeconds / 3600) % 24)}:${padNumberWithZeros(
      Math.trunc(absSeconds / 60) % 60,
    )}:${padNumberWithZeros(absSeconds % 60)}`
  }

  // Fixed 24 hours days, not calendar months like the previous date-fns implementation
  const duration = {
    days: Math.trunc(totalSeconds / 86_400),
    hours: Math.trunc(totalSeconds / 3600) % 24,
    minutes: Math.trunc(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60,
  }

  // Zero fields are omitted and an empty duration formats to an empty string,
  // as Intl.DurationFormat throws on a duration without any non-zero field
  const fields = Object.fromEntries(Object.entries(duration).filter(([, value]) => value !== 0))

  if (Object.keys(fields).length === 0) {
    return ''
  }

  return formatters.getDurationFormat(locale, { style: 'long', ...format }).format(fields)
}

export default formatDuration
