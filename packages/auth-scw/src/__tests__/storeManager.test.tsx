import { beforeEach, describe, expect, it } from 'vitest'
import { MOCK_ENCODED_JWT_COOKIE } from '../../mocks/index'
import { COOKIE_CONFIG } from '../constants'
import type { StorageType } from '../types'
import { createAuthStoreManager } from '../useAuthScw/authStoreManager'

// turn secure flag to false to let vitest store cookies in a "not secure" env. Only for testing
COOKIE_CONFIG.secure = false

const resetStorage = () => {
  const store = createAuthStoreManager({ storageType: 'cookie', suffixKey: 'test' })
  store.deleteAllJwts()
  store.deleteAudienceId()
  globalThis.localStorage.clear()
}

const createStore = (storageType: StorageType) => createAuthStoreManager({ storageType, suffixKey: 'test' })

describe.each(['cookie', 'localStorage'] satisfies StorageType[])('storemanager [%s]', storageType => {
  beforeEach(() => {
    resetStorage()
  })

  it('should return null when not initialized', () => {
    const storeManager = createStore(storageType)
    expect(storeManager.getAudienceId()).toBeNull()
    expect(storeManager.getJwt('')).toBeNull()
  })

  it('should return null when deleted', () => {
    const storeManager = createStore(storageType)
    storeManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })
    storeManager.deleteJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)
    expect(storeManager.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toBeNull()
  })

  it('should return encodedjwt', () => {
    const storeManager = createStore(storageType)
    storeManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })

    expect(storeManager.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toStrictEqual(
      // backends round-trip through JSON, so Date becomes a string.
      // oxlint-disable-next-line unicorn/prefer-structured-clone
      JSON.parse(JSON.stringify(MOCK_ENCODED_JWT_COOKIE)),
    )
  })

  it('should store and retrieve audienceId', () => {
    const storeManager = createStore(storageType)
    storeManager.setAudienceId(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)
    expect(storeManager.getAudienceId()).toBe(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)
  })

  it('should delete all jwts', () => {
    const storeManager = createStore(storageType)
    storeManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })
    storeManager.setJwt({
      jwtInfo: {
        ...MOCK_ENCODED_JWT_COOKIE,
        jwt: { ...MOCK_ENCODED_JWT_COOKIE.jwt, audienceId: 'another-audience' },
      },
    })
    storeManager.deleteAllJwts()
    expect(storeManager.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toBeNull()
    expect(storeManager.getJwt('another-audience')).toBeNull()
  })
})

describe('storemanager storage type', () => {
  it('should default to cookie storage', () => {
    resetStorage()
    expect(createAuthStoreManager().getStorageType()).toBe('cookie')
  })

  it('should respect storageType at creation', () => {
    expect(createAuthStoreManager({ storageType: 'localStorage' }).getStorageType()).toBe('localStorage')
    expect(createAuthStoreManager({ storageType: 'cookie' }).getStorageType()).toBe('cookie')
  })
})

describe('migrate cookie to local storage', () => {
  beforeEach(() => {
    resetStorage()
  })

  it('should report nothing migrated when no cookie exists', () => {
    const localStorageStore = createStore('localStorage')
    const result = localStorageStore.migrateCookieToLocalStorage()
    expect(result.migrated).toBe(false)
    expect(result.audienceId).toBeUndefined()
  })

  it('should migrate jwt and audienceId from cookie to localStorage and clean cookie', () => {
    const cookieStore = createStore('cookie')
    const localStorageStore = createStore('localStorage')

    // Seed cookie
    cookieStore.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })

    // Sanity: cookie has data, localStorage does not
    expect(cookieStore.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).not.toBeNull()
    expect(localStorageStore.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toBeNull()

    // Migrate
    const result = localStorageStore.migrateCookieToLocalStorage()
    expect(result.migrated).toBe(true)
    expect(result.audienceId).toBe(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)

    // localStorage now has the data
    expect(localStorageStore.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toStrictEqual(
      // backends round-trip through JSON, so Date becomes a string.
      // oxlint-disable-next-line unicorn/prefer-structured-clone
      JSON.parse(JSON.stringify(MOCK_ENCODED_JWT_COOKIE)),
    )
    expect(localStorageStore.getAudienceId()).toBe(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)

    // Cookie has been cleaned
    expect(cookieStore.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toBeNull()
    expect(cookieStore.getAudienceId()).toBeNull()
  })

  it('should be idempotent (no-op when called twice)', () => {
    const cookieStore = createStore('cookie')
    const localStorageStore = createStore('localStorage')

    cookieStore.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })

    const first = localStorageStore.migrateCookieToLocalStorage()
    expect(first.migrated).toBe(true)

    const second = localStorageStore.migrateCookieToLocalStorage()
    expect(second.migrated).toBe(false)

    // localStorage still has the data
    expect(localStorageStore.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).not.toBeNull()
  })
})
