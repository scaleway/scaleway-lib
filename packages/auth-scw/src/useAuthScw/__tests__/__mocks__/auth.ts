import type { EncodedJWT } from '../../../types'
import type { Accountv3 } from '../../../types/account'

export const MOCK_OIDC_LOGIN: Accountv3.InitiateOIDCLoginResponse = {
  securityToken: 'token123',
  url: 'http://myreidrecturl',
}

export const MOCK_LOGIN_SESSION: Accountv3.LoginSession = {
  id: '123456',
}

export const MOCK_AUDIENCE_ID = '8ff64ee7-41e0-42ea-a3a2-1e760b64690a'
export const MOCK_ISSUER_ID = '8ff64ee7-41e0-42ea-a3a2-1e760b64690a'

export const MOCK_ENCODED_JWT_COOKIE = {
  jwt: {
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    audienceId: MOCK_AUDIENCE_ID,
    ip: '51.159.46.153',
    issuerId: MOCK_ISSUER_ID,
    jti: 'f3d3166e-0b4b-494c-a7e4-b8e7f78a418b',
    userAgent: encodeURIComponent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    ),
  },
  renewToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZW5ld19rZXkiOiI2M2I0MWQ1MDU0ODU2ZWQ1MTZmMDFkNzFiZGU5ODY3ZGZhMjYzMDc0MWQ4YTEzMzkyNmNmYTM0MWE0ZmMzMWZmIn0.dPCsziFL2czNHUnK33_ESNII0s-uMSQFqpuu13URiqk',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4ZmY2NGVlNy00MWUwLTQyZWEtYTNhMi0xZTc2MGI2NDY5MGEiLCJhdWQiOiI4ZmY2NGVlNy00MWUwLTQyZWEtYTNhMi0xZTc2MGI2NDY5MGEiLCJleHAiOjE3MDA1NjMyNjgsImlhdCI6MTcwMDU1OTY2OCwianRpIjoiZjNkMzE2NmUtMGI0Yi00OTRjLWE3ZTQtYjhlN2Y3OGE0MThiIn0.Up9NEZ2UiT0HV4x9Eqz6QBG-aqIs0pFBtLe0cBmkP24',
} satisfies EncodedJWT
