import { describe, expect, test } from 'vitest'
import { marshalQueryKey } from '../helpers'

describe('marshalQueryKey', () => {
  test('should accept a string', () => {
    expect(marshalQueryKey('string')).toBe('string')
  })

  test('should accept a number', () => {
    expect(marshalQueryKey(0)).toBe('0')
    expect(marshalQueryKey(1)).toBe('1')
  })

  test('should accept primitive array', () => {
    const date = new Date('2021')
    expect(marshalQueryKey(['defaultKey', 3, null, false, date, true])).toBe(
      'defaultKey.3.false.2021-01-01T00:00:00.000Z.true',
    )

    expect(
      marshalQueryKey(
        ['default key', ['number', 3], ['null', null], ['false', false], ['date', date], ['boolean', true]].flat(),
      ),
    ).toBe('default key.number.3.null.false.false.date.2021-01-01T00:00:00.000Z.boolean.true')
  })

  test('should not accept object', () => {
    // @ts-expect-error used because we test with bad key
    expect(marshalQueryKey(['default key', { object: 'no' }])).toBe('default key.[object Object]')
  })
})
