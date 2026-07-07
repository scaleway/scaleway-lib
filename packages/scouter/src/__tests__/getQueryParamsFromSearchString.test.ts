// oxlint-disable vitest/prefer-expect-assertions
import { describe, expect, it } from 'vitest'
import { getQueryParamsFromSearchString } from '../helpers/getQueryParamsFromSearchString'

describe('getQueryParamsFromSearchString', () => {
  it('with empty search string', () => {
    expect(getQueryParamsFromSearchString('')).toEqual({})
  })

  it('with leading ?', () => {
    expect(getQueryParamsFromSearchString('?foo=bar')).toEqual({ foo: 'bar' })
  })

  it('without leading ?', () => {
    expect(getQueryParamsFromSearchString('foo=bar')).toEqual({ foo: 'bar' })
  })

  it('with single param', () => {
    expect(getQueryParamsFromSearchString('?foo=bar')).toEqual({ foo: 'bar' })
  })

  it('with multiple params', () => {
    expect(getQueryParamsFromSearchString('?foo=bar&baz=qux')).toEqual({
      foo: 'bar',
      baz: 'qux',
    })
  })

  it('with array params', () => {
    expect(getQueryParamsFromSearchString('?tags=admin&tags=user')).toEqual({
      tags: ['admin', 'user'],
    })
  })

  it('with encoded values', () => {
    expect(getQueryParamsFromSearchString('?q=hello%20world')).toEqual({
      q: 'hello world',
    })
  })

  it('with empty values', () => {
    expect(getQueryParamsFromSearchString('?foo=')).toEqual({ foo: '' })
  })

  it('with params without values', () => {
    expect(getQueryParamsFromSearchString('?foo')).toEqual({ foo: '' })
  })

  it('with mixed array and single params', () => {
    expect(getQueryParamsFromSearchString('?foo=bar&tags=admin&tags=user&baz=qux')).toEqual({
      foo: 'bar',
      tags: ['admin', 'user'],
      baz: 'qux',
    })
  })

  it('decodes plus signs as spaces', () => {
    expect(getQueryParamsFromSearchString('?q=hello+world')).toEqual({
      q: 'hello world',
    })
  })
})
