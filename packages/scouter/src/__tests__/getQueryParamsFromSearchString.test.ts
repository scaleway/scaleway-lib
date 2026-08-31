import { describe, expect, it } from 'vitest'
import { getQueryParamsFromSearchString } from '../helpers/getQueryParamsFromSearchString'

describe('getQueryParamsFromSearchString', () => {
  it('with empty search string', () => {
    expect(getQueryParamsFromSearchString('')).toStrictEqual({})
  })

  it('with leading ?', () => {
    expect(getQueryParamsFromSearchString('?foo=bar')).toStrictEqual({ foo: 'bar' })
  })

  it('without leading ?', () => {
    expect(getQueryParamsFromSearchString('foo=bar')).toStrictEqual({ foo: 'bar' })
  })

  it('with single param', () => {
    expect(getQueryParamsFromSearchString('?foo=bar')).toStrictEqual({ foo: 'bar' })
  })

  it('with multiple params', () => {
    expect(getQueryParamsFromSearchString('?foo=bar&baz=qux')).toStrictEqual({
      foo: 'bar',
      baz: 'qux',
    })
  })

  it('with array params', () => {
    expect(getQueryParamsFromSearchString('?tags=admin&tags=user')).toStrictEqual({
      tags: ['admin', 'user'],
    })
  })

  it('with encoded values', () => {
    expect(getQueryParamsFromSearchString('?q=hello%20world')).toStrictEqual({
      q: 'hello world',
    })
  })

  it('with empty values', () => {
    expect(getQueryParamsFromSearchString('?foo=')).toStrictEqual({ foo: '' })
  })

  it('with params without values', () => {
    expect(getQueryParamsFromSearchString('?foo')).toStrictEqual({ foo: '' })
  })

  it('with mixed array and single params', () => {
    expect(getQueryParamsFromSearchString('?foo=bar&tags=admin&tags=user&baz=qux')).toStrictEqual({
      foo: 'bar',
      tags: ['admin', 'user'],
      baz: 'qux',
    })
  })

  it('decodes plus signs as spaces', () => {
    expect(getQueryParamsFromSearchString('?q=hello+world')).toStrictEqual({
      q: 'hello world',
    })
  })
})
