import { describe, expect, it } from 'vitest'
import {
  DAYS_IN_MONTH,
  DAYS_IN_WEEK,
  DAYS_IN_YEAR,
  HOURS_IN_DAY,
  HOURS_IN_MONTH,
  HOURS_IN_YEAR,
  MONTHS_IN_YEAR,
  SECONDS_IN_DAY,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
  SECONDS_IN_MONTH,
} from '../constants'

describe('constants', () => {
  it.each([
    ['DAYS_IN_MONTH', DAYS_IN_MONTH],
    ['DAYS_IN_WEEK', DAYS_IN_WEEK],
    ['DAYS_IN_YEAR', DAYS_IN_YEAR],
    ['HOURS_IN_DAY', HOURS_IN_DAY],
    ['HOURS_IN_MONTH', HOURS_IN_MONTH],
    ['HOURS_IN_YEAR', HOURS_IN_YEAR],
    ['MONTHS_IN_YEAR', MONTHS_IN_YEAR],
    ['SECONDS_IN_DAY', SECONDS_IN_DAY],
    ['SECONDS_IN_HOUR', SECONDS_IN_HOUR],
    ['SECONDS_IN_MINUTE', SECONDS_IN_MINUTE],
    ['SECONDS_IN_MONTH', SECONDS_IN_MONTH],
  ])('%s', (_, args) => {
    expect(args).toMatchSnapshot()
  })
})
