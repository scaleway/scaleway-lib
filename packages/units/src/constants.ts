import { convertDuration } from './convertDuration'

export const SECONDS_IN_MINUTE = convertDuration(1, { from: 'minutes', to: 'seconds' })
export const SECONDS_IN_HOUR = convertDuration(1, { from: 'hours', to: 'seconds' })
export const SECONDS_IN_DAY = convertDuration(1, { from: 'days', to: 'seconds' })
export const SECONDS_IN_MONTH = convertDuration(1, { from: 'months', to: 'seconds' })

export const DAYS_IN_WEEK = convertDuration(1, { from: 'weeks', to: 'days' })
export const DAYS_IN_MONTH = convertDuration(1, { from: 'months', to: 'days' })
export const DAYS_IN_YEAR = convertDuration(1, { from: 'years', to: 'days' })

export const HOURS_IN_DAY = convertDuration(1, { from: 'days', to: 'hours' })
export const HOURS_IN_MONTH = convertDuration(1, { from: 'months', to: 'hours' })
export const HOURS_IN_YEAR = convertDuration(1, { from: 'years', to: 'hours' })

export const MONTHS_IN_YEAR = convertDuration(1, { from: 'years', to: 'months' })
