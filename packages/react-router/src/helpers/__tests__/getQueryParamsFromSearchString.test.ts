import { describe, expect, it } from 'vitest'
import { getQueryParamsFromSearchString } from '../getQueryParamsFromSearchString'

describe('getqueryparamsfromsearchstring', () => {
  it('should work with simple case', () => {
    expect(getQueryParamsFromSearchString('first=param&second=test')).toStrictEqual({ first: 'param', second: 'test' })
  })

  it('should return array when a key appear multiples times', () => {
    expect(getQueryParamsFromSearchString('first=param&tags=one&tags=two')).toStrictEqual({
      first: 'param',
      tags: ['one', 'two'],
    })
  })

  it('should handle a subsearch string without transform it', () => {
    expect(
      getQueryParamsFromSearchString('first=param&state=code=ssocode%26provider=google&third=param'),
    ).toStrictEqual({
      first: 'param',
      state: 'code=ssocode&provider=google',
      third: 'param',
    })
  })
})
