import { beforeEach, describe, expect, it } from 'vitest'
import { MOCK_ENCODED_JWT_COOKIE } from '../../mocks/index'
import { COOKIE_CONFIG } from '../constants'
import type { StorageType } from '../types'
import {
  AuthStoreManager,
  getStorageType,
  migrateCookieToLocalStorage,
  setStorageType,
} from '../useAuthScw/authStoreManager'

// turn secure flag to false to let vitest store cookies in a "not secure" env. Only for testing
COOKIE_CONFIG.secure = false

const resetStorage = () => {
  // Cookies
  AuthStoreManager.deleteAllJwts()
  AuthStoreManager.deleteAudienceId()
  // localStorage
  globalThis.localStorage.clear()
}

describe.each(['cookie', 'localStorage'] satisfies StorageType[])('storemanager [%s]', storageType => {
  beforeEach(() => {
    resetStorage()
    setStorageType(storageType)
    AuthStoreManager.setSuffixKey('test')
  })

  it('should return null when not initialized', () => {
    expect(AuthStoreManager.getAudienceId()).toBeNull()
    expect(AuthStoreManager.getJwt('')).toBeNull()
  })

  it('should return null when deleted', () => {
    AuthStoreManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })
    AuthStoreManager.deleteJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)
    expect(AuthStoreManager.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toBeNull()
  })

  it('should return encodedjwt', () => {
    AuthStoreManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })

    expect(AuthStoreManager.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toStrictEqual(
      // structuredClone does not copy Date ref
      // oxlint-disable-next-line unicorn/prefer-structured-clone
      JSON.parse(JSON.stringify(MOCK_ENCODED_JWT_COOKIE)),
    )
  })

  it('should store and retrieve audienceId', () => {
    AuthStoreManager.setAudienceId(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)
    expect(AuthStoreManager.getAudienceId()).toBe(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)
  })

  it('should delete all jwts', () => {
    AuthStoreManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })
    AuthStoreManager.setJwt({
      jwtInfo: {
        ...MOCK_ENCODED_JWT_COOKIE,
        jwt: { ...MOCK_ENCODED_JWT_COOKIE.jwt, audienceId: 'another-audience' },
      },
    })
    AuthStoreManager.deleteAllJwts()
    expect(AuthStoreManager.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toBeNull()
    expect(AuthStoreManager.getJwt('another-audience')).toBeNull()
  })
})

describe('storemanager storage type', () => {
  it('should default to cookie storage', () => {
    resetStorage()
    setStorageType('cookie')
    expect(getStorageType()).toBe('cookie')
  })

  it('should switch storage type', () => {
    setStorageType('localStorage')
    expect(getStorageType()).toBe('localStorage')
    setStorageType('cookie')
    expect(getStorageType()).toBe('cookie')
  })
})

describe('migrateCookieToLocalStorage', () => {
  beforeEach(() => {
    resetStorage()
    setStorageType('cookie')
    AuthStoreManager.setSuffixKey('test')
  })

  it('should report nothing migrated when no cookie exists', () => {
    setStorageType('localStorage')
    const result = migrateCookieToLocalStorage()
    expect(result.migrated).toBe(false)
    expect(result.audienceId).toBeUndefined()
  })

  it('should migrate jwt and audienceId from cookie to localStorage and clean cookie', () => {
    // Seed cookie
    setStorageType('cookie')
    AuthStoreManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })

    // Sanity: cookie has data, localStorage does not
    expect(AuthStoreManager.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).not.toBeNull()
    setStorageType('localStorage')
    expect(AuthStoreManager.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toBeNull()

    // Migrate
    const result = migrateCookieToLocalStorage()
    expect(result.migrated).toBe(true)
    expect(result.audienceId).toBe(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)

    // localStorage now has the data
    expect(AuthStoreManager.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toStrictEqual(
      JSON.parse(JSON.stringify(MOCK_ENCODED_JWT_COOKIE)),
    )
    expect(AuthStoreManager.getAudienceId()).toBe(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)

    // Cookie has been cleaned
    setStorageType('cookie')
    expect(AuthStoreManager.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toBeNull()
    expect(AuthStoreManager.getAudienceId()).toBeNull()
  })

  it('should be idempotent (no-op when called twice)', () => {
    setStorageType('cookie')
    AuthStoreManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })

    setStorageType('localStorage')
    const first = migrateCookieToLocalStorage()
    expect(first.migrated).toBe(true)

    const second = migrateCookieToLocalStorage()
    expect(second.migrated).toBe(false)

    // localStorage still has the data
    expect(AuthStoreManager.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).not.toBeNull()
  })
})
