import type { AudienceIdType, CookieConfigType, EncodedJWT } from './types'

export const SESSION_EXPIRED_SAFETY = 30 // secondes

export const EmptyAudienceId: AudienceIdType = {
  audienceId: '',
}

export const EmptySession: NonNullable<EncodedJWT> = {
  jwt: {
    audienceId: '',
    createdAt: undefined,
    expiresAt: undefined,
    ip: '',
    issuerId: '',
    jti: '',
    updatedAt: undefined,
    userAgent: '',
  },
  renewToken: '',
  token: '',
}

export const LOCAL_STORAGE_JWTS_KEY = '_scw_auth_state'

export const COOKIE_CONFIG: CookieConfigType = {
  httpOnly: false,
  path: '/',
  sameSite: 'strict',
  secure: true,
}
