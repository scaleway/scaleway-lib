import { convertDuration } from './convertDuration'

/** 60 */
export const SECONDS_IN_MINUTE = convertDuration(1, { from: 'minutes', to: 'seconds' })
/** 3600 */
export const SECONDS_IN_HOUR = convertDuration(1, { from: 'hours', to: 'seconds' })
/** 86400 */
export const SECONDS_IN_DAY = convertDuration(1, { from: 'days', to: 'seconds' })
/** 2628000 */
export const SECONDS_IN_MONTH = convertDuration(1, { from: 'months', to: 'seconds' })

/** 7 */
export const DAYS_IN_WEEK = convertDuration(1, { from: 'weeks', to: 'days' })
/** 30.416666666666668 */
export const DAYS_IN_MONTH = convertDuration(1, { from: 'months', to: 'days' })
/** 365 */
export const DAYS_IN_YEAR = convertDuration(1, { from: 'years', to: 'days' })

/** 24 */
export const HOURS_IN_DAY = convertDuration(1, { from: 'days', to: 'hours' })
/** 730 */
export const HOURS_IN_MONTH = convertDuration(1, { from: 'months', to: 'hours' })
/** 8760 */
export const HOURS_IN_YEAR = convertDuration(1, { from: 'years', to: 'hours' })
/** 12 */
export const MONTHS_IN_YEAR = convertDuration(1, { from: 'years', to: 'months' })
