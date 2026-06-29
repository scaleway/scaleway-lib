import type { ReactNode } from 'react'
import { vi } from 'vitest'
import type { AuthScwContextType } from '../src/index'
import type { Accountv3 } from '../src/types/account/index'
import type { JWT } from '../src/types/account/types'
import type { Iamv1alpha1 } from '../src/types/iam/index'

const MOCK_OIDC_LOGIN: Accountv3.InitiateOIDCLoginResponse = {
  securityToken: 'token123',
  url: 'http://myreidrecturl',
}

const MOCK_SAML_LOGIN: Iamv1alpha1.InitiateSamlLoginResponse = {
  relayState: 'relayState',
  samlRequest: 'samlRequest',
  url: 'http://myreidrecturl',
}

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
} satisfies Accountv3.LogInResponse

const mockGetJWT = vi.fn(() => Promise.resolve({ ...MOCK_ENCODED_JWT_COOKIE, source: 'cookie' as const }))
const mockGetJwtToken = vi.fn(() => Promise.resolve(MOCK_ENCODED_JWT_COOKIE.token))
const mockIamMemberCheckLoginMFAOTP = vi.fn(() => Promise.resolve())
const mockIamMemberCommitLogin = vi.fn(() => Promise.resolve(MOCK_ENCODED_JWT_COOKIE))
const mockIamMemberCreateMagicCodeLogin = vi.fn(() => Promise.resolve({ id: 'id', mfaRequired: false }))
const mockIamMemberCreateOAuth2Login = vi.fn(() => Promise.resolve({ id: 'id', mfaRequired: false }))
const mockIamMemberInitiateMagicCodeLogin = vi.fn(() => Promise.resolve())
const mockIamMemberInitiateOAuth2Login = vi.fn(() => Promise.resolve(MOCK_OIDC_LOGIN))
const mockIamMemberInitiateSamlLogin = vi.fn(() => Promise.resolve(MOCK_SAML_LOGIN))
const mockIamMemberPasswordLogin = vi.fn(() => Promise.resolve({ id: 'id', mfaRequired: false }))

const mockIamMemberSearchOrganization = vi.fn<() => Promise<Iamv1alpha1.OrganizationSummary>>(() =>
  Promise.resolve({
    id: 'id-organization-1',
    loginMagicCodeEnabled: true,
    loginOauth2Enabled: true,
    loginPasswordEnabled: true,
    loginSamlEnabled: true,
    name: 'organization-1',
  }),
)

const mockInitiateOidcLogin = vi.fn(() => Promise.resolve(MOCK_OIDC_LOGIN))
const mockStartWebAuthnAuthentication = vi.fn(() => Promise.resolve({ id: 'ceremony-id' }))
const mockInitiatePasswordlessLogin = vi.fn(() => Promise.resolve())
const mockLoginOrganizations = vi.fn(() =>
  Promise.resolve({
    organizationsLoginInformation: [
      {
        organizationId: 'id',
        organizationName: 'name',
        ...MOCK_ENCODED_JWT_COOKIE,
      },
    ],
  }),
)
const mockLoginSession = vi.fn(() => Promise.resolve({ id: 'mocked-login-session-id' }))
const mockInitiateAuthenticationCodeLogin = vi.fn(() => Promise.resolve({}))
const mockResendAuthenticationCode = vi.fn(function mockResendAuthenticationCode() {
  return Promise.resolve()
})
const mockLogout = vi.fn()
const mockRenewToken = vi.fn(() => Promise.resolve(MOCK_ENCODED_JWT_COOKIE))

const defaultMockUseAuthScw: AuthScwContextType = {
  audienceId: MOCK_ENCODED_JWT_COOKIE.jwt.audienceId,
  authenticated: true,
  decodeToken: vi.fn(),
  encodeToken: vi.fn(),
  getJWT: mockGetJWT,
  getJwtToken: mockGetJwtToken,
  iamMemberCheckLoginMFAOTP: mockIamMemberCheckLoginMFAOTP,
  iamMemberCommitLogin: mockIamMemberCommitLogin,
  iamMemberCreateMagicCodeLogin: mockIamMemberCreateMagicCodeLogin,
  iamMemberCreateOAuth2Login: mockIamMemberCreateOAuth2Login,
  iamMemberCreatePasswordLogin: mockIamMemberPasswordLogin,
  iamMemberInitiateMagicCodeLogin: mockIamMemberInitiateMagicCodeLogin,
  iamMemberInitiateOAuth2Login: mockIamMemberInitiateOAuth2Login,
  iamMemberInitiateSamlLogin: mockIamMemberInitiateSamlLogin,
  iamMemberSearchOrganization: mockIamMemberSearchOrganization,
  initiateAuthenticationCodeLogin: mockInitiateAuthenticationCodeLogin,
  initiateOidcLogin: mockInitiateOidcLogin,
  loginOrganizations: mockLoginOrganizations,
  loginSession: mockLoginSession,
  logout: mockLogout,
  resendAuthenticationCode: mockResendAuthenticationCode,
  setAudienceId: vi.fn(),
  setJWT: vi.fn(),
  startWebAuthnAuthentication: mockStartWebAuthnAuthentication,
} satisfies AuthScwContextType

const useAuthScw = vi.fn<() => AuthScwContextType>(() => defaultMockUseAuthScw)

const AuthScwProvider = ({ children }: { children: ReactNode }) => children

const AuthStoreManager = {
  getJwt: vi.fn((): JWT | null => MOCK_ENCODED_JWT_COOKIE.jwt),
}

const useGetDediboxRedirectionUrlWithToken = vi.fn(() => vi.fn((url: string) => `${url}`))

export {
  MOCK_OIDC_LOGIN,
  MOCK_ENCODED_JWT_COOKIE,
  AuthScwProvider,
  defaultMockUseAuthScw,
  mockGetJWT,
  mockInitiateAuthenticationCodeLogin,
  mockResendAuthenticationCode,
  mockIamMemberCheckLoginMFAOTP,
  mockIamMemberCommitLogin,
  mockIamMemberCreateMagicCodeLogin,
  mockIamMemberCreateOAuth2Login,
  mockIamMemberInitiateMagicCodeLogin,
  mockIamMemberInitiateOAuth2Login,
  mockIamMemberInitiateSamlLogin,
  mockIamMemberPasswordLogin,
  mockIamMemberSearchOrganization,
  mockInitiateOidcLogin,
  mockStartWebAuthnAuthentication,
  mockInitiatePasswordlessLogin,
  mockLoginOrganizations,
  mockLoginSession,
  mockLogout,
  mockRenewToken,
  useAuthScw,
  AuthStoreManager,
  useGetDediboxRedirectionUrlWithToken,
}
