import { describe, expect, it } from 'vitest'
import { isExpired, SESSION_EXPIRED_SAFETY } from './isExpired'

describe('isexpired', () => {
  it('should return true if the current time is past the expiry time minus safety margin', () => {
    const expireTimestampRaw = new Date(Date.now() - 2 * SESSION_EXPIRED_SAFETY * 1000) // expired time
    expect(isExpired(expireTimestampRaw)).toBe(true)
  })

  it('should return false if the current time is before the expiry time minus safety margin', () => {
    const expireTimestampRaw = new Date(Date.now() + 2 * SESSION_EXPIRED_SAFETY * 1000) // future time
    expect(isExpired(expireTimestampRaw)).toBe(false)
  })

  it('should return false if the current time is exactly at the expiry time minus safety margin', () => {
    const expireTimestampRaw = new Date(Date.now() + SESSION_EXPIRED_SAFETY * 1000)
    expect(isExpired(expireTimestampRaw)).toBe(false)
  })

  it('should return true if the expiry time is in the past regardless of safety margin', () => {
    const expireTimestampRaw = new Date(Date.now() - 1000) // past time
    expect(isExpired(expireTimestampRaw)).toBe(true)
  })

  it('should handle edge cases when the expiry time is exactly now minus safety margin', () => {
    const now = Date.now()
    const expireTimestampRaw = new Date(now - SESSION_EXPIRED_SAFETY * 1000)
    expect(isExpired(expireTimestampRaw)).toBe(true)
  })
})
