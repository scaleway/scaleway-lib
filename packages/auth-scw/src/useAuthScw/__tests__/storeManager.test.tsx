import { describe, expect, it } from 'vitest'
import { COOKIE_CONFIG } from '../../constants'
import { AuthStoreManager } from '../authStoreManager'
import { MOCK_ENCODED_JWT_COOKIE } from './__mocks__/auth'

// turn secure flag to false to let vitest store cookies in a "not secure" env. Only for testing
COOKIE_CONFIG.secure = false

describe('storemanager', () => {
  it('should return null cookie when not initialized', () => {
    expect(AuthStoreManager.getAudienceId()).toStrictEqual(null)
    expect(AuthStoreManager.getJwt('')).toStrictEqual(null)
  })

  it('should return null cookie when deleted', () => {
    AuthStoreManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })
    AuthStoreManager.deleteJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)
    expect(AuthStoreManager.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toStrictEqual(null)
  })

  it('should return encodedjwt cookie', () => {
    AuthStoreManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })

    expect(AuthStoreManager.getJwt(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)).toStrictEqual(
      JSON.parse(JSON.stringify(MOCK_ENCODED_JWT_COOKIE)),
    )
  })
})
