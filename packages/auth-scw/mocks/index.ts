import type { ReactNode } from 'react'
import { vi } from 'vitest'
import type { AuthScwContextType } from '../src/index'
import type { JWT, EncodedJWT } from '../src/types/iam/types'

const MOCK_ENCODED_JWT_COOKIE = {
  jwt: {
    audienceId: 'audienceIdTest',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    ip: '51.159.46.153',
    issuerId: '8ff64ee7-41e0-42ea-a3a2-1e760b64690a',
    jti: 'jtiTest',
    userAgent: encodeURIComponent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    ),
  },
  renewToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZW5ld19rZXkiOiI2M2I0MWQ1MDU0ODU2ZWQ1MTZmMDFkNzFiZGU5ODY3ZGZhMjYzMDc0MWQ4YTEzMzkyNmNmYTM0MWE0ZmMzMWZmIn0.dPCsziFL2czNHUnK33_ESNII0s-uMSQFqpuu13URiqk',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4ZmY2NGVlNy00MWUwLTQyZWEtYTNhMi0xZTc2MGI2NDY5MGEiLCJhdWQiOiI4ZmY2NGVlNy00MWUwLTQyZWEtYTNhMi0xZTc2MGI2NDY5MGEiLCJleHAiOjE3MDA1NjMyNjgsImlhdCI6MTcwMDU1OTY2OCwianRpIjoiZjNkMzE2NmUtMGI0Yi00OTRjLWE3ZTQtYjhlN2Y3OGE0MThiIn0.Up9NEZ2UiT0HV4x9Eqz6QBG-aqIs0pFBtLe0cBmkP24',
} satisfies EncodedJWT

const mockGetJWT = vi.fn(() => Promise.resolve({ ...MOCK_ENCODED_JWT_COOKIE, source: 'cookie' as const }))
const mockGetJwtToken = vi.fn(() => Promise.resolve(MOCK_ENCODED_JWT_COOKIE.token))

const mockLogout = vi.fn()
const mockRenewToken = vi.fn(() => Promise.resolve(MOCK_ENCODED_JWT_COOKIE))

const defaultMockUseAuthScw: AuthScwContextType = {
  audienceId: MOCK_ENCODED_JWT_COOKIE.jwt.audienceId,
  authenticated: true,
  decodeToken: vi.fn(),
  encodeToken: vi.fn(),
  getJWT: mockGetJWT,
  getJwtToken: mockGetJwtToken,
  logout: mockLogout,
  setAudienceId: vi.fn(),
  setJWT: vi.fn(),
} satisfies AuthScwContextType

const useAuthScw = vi.fn<() => AuthScwContextType>(() => defaultMockUseAuthScw)

const AuthScwProvider = ({ children }: { children: ReactNode }) => children

const AuthStoreManager = {
  getJwt: vi.fn((): JWT | null => MOCK_ENCODED_JWT_COOKIE.jwt),
}

export {
  MOCK_ENCODED_JWT_COOKIE,
  AuthScwProvider,
  defaultMockUseAuthScw,
  mockGetJWT,
  mockLogout,
  mockRenewToken,
  useAuthScw,
  AuthStoreManager,
}
