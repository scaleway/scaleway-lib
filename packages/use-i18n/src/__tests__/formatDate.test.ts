import { describe, expect, test } from 'vitest'
import type { FormatDateOptions } from '../formatDate'
import formatDate, { supportedFormats } from '../formatDate'

const locales = ['en', 'fr', 'de', 'ro', 'es']

const tests = [
  ...locales.map(locale => [
    ...supportedFormats.map(format => [
      format,
      'new Date(2020, 1, 13, 16, 28)',
      locale,
      new Date(2020, 1, 13, 16, 28),
    ]),
  ]),
  ...locales.map(locale => [
    ...supportedFormats.map(format => [
      format,
      '1581607680000',
      locale,
      1581607680000,
    ]),
  ]),
  ...locales.map(locale => [
    ...supportedFormats.map(format => [
      format,
      '2020-02-13T15:28:00.000Z',
      locale,
      '2020-02-13T15:28:00.000Z',
    ]),
  ]),
].flat() as [FormatDateOptions, string, string, Date | string | number][]

describe('formatDate', () => {
  test.each(tests)(
    'should work with format "%s", for date = "%s" and locale "%s"',
    (format, _, locale, date) => {
      expect(formatDate(locale, date, format)).toMatchSnapshot()
    },
  )

  test.each(locales)('should work with custom format and locale %s', locale => {
    const format: FormatDateOptions = {
      day: 'numeric',
      era: 'short',
      hour: '2-digit',
      minute: 'numeric',
      month: 'narrow',
      second: '2-digit',
      timeZoneName: 'long',
      weekday: 'long',
      year: '2-digit',
    }

    expect(
      formatDate(locale, new Date(2020, 1, 13, 16, 28), format),
    ).toMatchSnapshot()
    expect(formatDate(locale, 1581607680000, format)).toMatchSnapshot()
    expect(
      formatDate(locale, '2020-02-13T15:28:00.000Z', format),
    ).toMatchSnapshot()
  })

  test('should return passed object if not valid date', () => {
    expect(
      // @ts-expect-error we check a failing case
      formatDate('fr', { not: 'a valid date' }),
    ).toMatchSnapshot()
  })

  test('should throw if shorthand format is invalid', () => {
    expect(() =>
      // @ts-expect-error we check a failing case
      formatDate('fr', 1581607680000, 'not a valid format'),
    ).toThrowError(
      'format "not a valid format" should be one of hour, hourOnly, long, short, shortWithoutDay, numeric, numericHour or a valid Intl.DateTimeFormat options object',
    )
  })
})
