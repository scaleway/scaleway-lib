import { describe, expect, it } from 'vitest'
import { MOCK_ENCODED_JWT_COOKIE } from '../../mocks'
import { proxyJwt } from '../useAuthScw/proxyJwt'

describe('proxyJwt', () => {
  it('should return the same JWT when updateJwt is undefined', () => {
    const result = proxyJwt(MOCK_ENCODED_JWT_COOKIE)
    expect(result).toBe(MOCK_ENCODED_JWT_COOKIE)
  })

  it('should return the same JWT when shouldOutdated is false', () => {
    const result = proxyJwt(MOCK_ENCODED_JWT_COOKIE, {
      shouldOutdated: false,
      subMinuteOfExpires: 30,
      subSecondesOfExpires: 10,
    })
    expect(result).toBe(MOCK_ENCODED_JWT_COOKIE)
  })

  it('should return a JWT with updated expiresAt when shouldOutdated is true', () => {
    const result = proxyJwt(MOCK_ENCODED_JWT_COOKIE, {
      shouldOutdated: true,
      subMinuteOfExpires: 30,
      subSecondesOfExpires: 10,
    })
    expect(result.jwt?.expiresAt).toBeDefined()
    expect(result.jwt?.expiresAt).not.toBe(MOCK_ENCODED_JWT_COOKIE.jwt?.expiresAt)
    expect(result.jwt?.expiresAt).toBeInstanceOf(Date)
  })

  it('should subtract the specified minutes and seconds from expiresAt when shouldOutdated is true', () => {
    const subMinuteOfExpires = 10
    const subSecondesOfExpires = 30
    const result = proxyJwt(MOCK_ENCODED_JWT_COOKIE, {
      shouldOutdated: true,
      subMinuteOfExpires,
      subSecondesOfExpires,
    })

    const expectedExpiresAt = new Date(MOCK_ENCODED_JWT_COOKIE.jwt!.expiresAt!)
    expectedExpiresAt.setMinutes(expectedExpiresAt.getMinutes() - subMinuteOfExpires)
    expectedExpiresAt.setSeconds(expectedExpiresAt.getSeconds() - subSecondesOfExpires)

    expect(new Date(result.jwt!.expiresAt!).getTime()).toBe(expectedExpiresAt.getTime())
  })

  it('should use default values when updateJwt is undefined', () => {
    const result = proxyJwt(MOCK_ENCODED_JWT_COOKIE)
    expect(result).toBe(MOCK_ENCODED_JWT_COOKIE)
  })

  it('should preserve all other JWT properties when shouldOutdated is true', () => {
    const result = proxyJwt(MOCK_ENCODED_JWT_COOKIE, {
      shouldOutdated: true,
      subMinuteOfExpires: 5,
      subSecondesOfExpires: 5,
    })
    expect(result.jwt?.audienceId).toBe(MOCK_ENCODED_JWT_COOKIE.jwt?.audienceId)
    expect(result.jwt?.ip).toBe(MOCK_ENCODED_JWT_COOKIE.jwt?.ip)
    expect(result.jwt?.issuerId).toBe(MOCK_ENCODED_JWT_COOKIE.jwt?.issuerId)
    expect(result.jwt?.jti).toBe(MOCK_ENCODED_JWT_COOKIE.jwt?.jti)
    expect(result.token).toBe(MOCK_ENCODED_JWT_COOKIE.token)
    expect(result.renewToken).toBe(MOCK_ENCODED_JWT_COOKIE.renewToken)
  })

  it('should handle JWT without expiresAt when shouldOutdated is true', () => {
    const jwtWithoutExpiresAt = {
      ...MOCK_ENCODED_JWT_COOKIE,
      jwt: {
        ...MOCK_ENCODED_JWT_COOKIE.jwt,
        expiresAt: undefined,
      },
    }

    const result = proxyJwt(jwtWithoutExpiresAt, {
      shouldOutdated: true,
      subMinuteOfExpires: 10,
      subSecondesOfExpires: 5,
    })
    expect(result.jwt?.expiresAt).toBeUndefined()
    expect(result.jwt?.audienceId).toBe(MOCK_ENCODED_JWT_COOKIE.jwt?.audienceId)
    expect(result.token).toBe(MOCK_ENCODED_JWT_COOKIE.token)
  })

  it('should handle zero subMinuteOfExpires and subSecondesOfExpires', () => {
    const result = proxyJwt(MOCK_ENCODED_JWT_COOKIE, {
      shouldOutdated: true,
      subMinuteOfExpires: 0,
      subSecondesOfExpires: 0,
    })
    expect(new Date(result.jwt!.expiresAt!).getTime()).toBe(new Date(MOCK_ENCODED_JWT_COOKIE.jwt!.expiresAt!).getTime())
  })

  it('should return a new object reference when shouldOutdated is true', () => {
    const result = proxyJwt(MOCK_ENCODED_JWT_COOKIE, {
      shouldOutdated: true,
      subMinuteOfExpires: 5,
      subSecondesOfExpires: 5,
    })
    expect(result).not.toBe(MOCK_ENCODED_JWT_COOKIE)
    expect(result.jwt).not.toBe(MOCK_ENCODED_JWT_COOKIE.jwt)
  })
})
