type Unit = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'

const MILLISECONDS_IN_SECOND = 1000
const SECONDS_IN_MINUTE = 60
const MINUTES_IN_HOUR = 60
const HOURS_IN_DAY = 24
const MONTHS_IN_YEAR = 12
const DAYS_IN_YEAR = 365
const DAYS_IN_WEEK = 7
const HOURS_IN_MONTH = (DAYS_IN_YEAR / MONTHS_IN_YEAR) * HOURS_IN_DAY
const DAYS_IN_MONTH = HOURS_IN_MONTH / HOURS_IN_DAY

const millisecondsInUnit: Record<Unit, number> = {
  milliseconds: 1,
  seconds: MILLISECONDS_IN_SECOND,
  minutes: MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE,
  hours: MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR,
  days: MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY,
  weeks: MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_WEEK,
  months: MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_MONTH,
  years: MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_YEAR,
}

type ConvertUnitArgs = {
  from?: Unit
  to?: Unit
}

/**
 * Converts a numeric duration from one time unit to another.
 *
 * `amount` is first converted to milliseconds using `from`, then converted
 * to the target unit using `to`. `months` and `years` are approximations
 * based on a 365-day year (no leap-year adjustment), so a "month" is
 * `365 / 12 ≈ 30.42` days — not a calendar month.
 *
 * @param amount - The numeric duration to convert.
 * @param options - Conversion options.
 * @param options.from - The unit `amount` is currently expressed in. Defaults to `'seconds'`.
 * @param options.to - The unit to convert `amount` into. Defaults to `'seconds'`.
 *
 * @returns `amount` expressed in the `to` unit.
 *
 * @example
 * // 90 seconds -> minutes
 * convertDuration(90, { from: 'seconds', to: 'minutes' }) // 1.5
 *
 * @example
 * // 3 hours -> milliseconds
 * convertDuration(3, { from: 'hours', to: 'milliseconds' }) // 10800000
 *
 * @example
 * // 2 weeks -> days
 * convertDuration(2, { from: 'weeks', to: 'days' }) // 14
 *
 * @example
 * // 18 months -> years (approximate, non-calendar months)
 * convertDuration(18, { from: 'months', to: 'years' }) // 1.5
 */
export const convertDuration = (amount: number, { from = 'seconds', to = 'seconds' }: ConvertUnitArgs) => {
  const fromInMilliseconds = amount * millisecondsInUnit[from]

  return fromInMilliseconds / millisecondsInUnit[to]
}
