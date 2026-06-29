import type { Client as SDKClient, Settings } from '@scaleway/sdk-client'
import { API as SDKAPI } from '@scaleway/sdk-client'
import type { z } from 'zod'
import type { audienceIdSchema, jwtSchema } from '../zodSchemas'
import type { Accountv3 } from './account'
// oxlint-disable eslint/max-classes-per-file
import type { Iamv1alpha1 } from './iam'

export type EncodedJWT = z.infer<typeof jwtSchema>
export type AudienceIdType = z.infer<typeof audienceIdSchema>

export type OnError = (onError: { title: string; error: unknown; extra?: Record<string, unknown> }) => void

type GetJWT = (audienceId?: string) => Promise<
  | (EncodedJWT & {
      source: 'refreshSession' | 'cookie'
    })
  | undefined
>

type GetJwtTokenResponse = NonNullable<Awaited<ReturnType<GetJWT>>>['token'] | undefined

export type AuthScwContextType = {
  audienceId?: string
  setAudienceId: (audienceId: string) => void
  jti?: string
  encodeToken: (jwt: EncodedJWT) => string
  decodeToken: (encodedToken: string) => EncodedJWT | null
  setJWT: (jwtInfoParam: EncodedJWT) => void
  getJWT: GetJWT
  getJwtToken: (audienceId?: string) => Promise<GetJwtTokenResponse>
  initiateOidcLogin: (
    params: Accountv3.UnauthenticatedUserApiInitiateOIDCLoginRequest,
  ) => Promise<Accountv3.InitiateOIDCLoginResponse>
  initiateAuthenticationCodeLogin: (
    params: Accountv3.UnauthenticatedUserApiInitiateAuthenticationCodeLoginRequest,
  ) => Promise<Accountv3.InitiateAuthenticationCodeLoginResponse>
  resendAuthenticationCode: (params: Accountv3.UnauthenticatedUserApiResendAuthenticationCodeRequest) => Promise<void>
  loginSession: (
    loginSessionInput: Accountv3.UnauthenticatedUserApiCreateLoginSessionRequest,
  ) => Promise<Accountv3.LoginSession>
  loginOrganizations: (params: LoginOrganizationsInputsType) => Promise<Accountv3.LogInOrganizationsResponse>
  startWebAuthnAuthentication: (
    params: Accountv3.UnauthenticatedUserApiStartWebAuthnAuthenticationRequest,
  ) => Promise<Accountv3.StartWebAuthnAuthenticationResponse>
  iamMemberSearchOrganization: (
    params: Iamv1alpha1.UnauthenticatedApiSearchOrganizationRequest,
  ) => Promise<Iamv1alpha1.OrganizationSummary>
  iamMemberInitiateOAuth2Login: (
    params: Iamv1alpha1.UnauthenticatedApiInitiateOAuth2LoginRequest,
  ) => Promise<Iamv1alpha1.InitiateOAuth2LoginResponse>
  iamMemberInitiateSamlLogin: (
    params: Iamv1alpha1.UnauthenticatedApiInitiateSamlLoginRequest,
  ) => Promise<Iamv1alpha1.InitiateSamlLoginResponse>
  iamMemberCreateOAuth2Login: (
    input: Iamv1alpha1.UnauthenticatedApiCreateOAuth2LoginRequest,
  ) => Promise<Iamv1alpha1.Login>
  iamMemberCreatePasswordLogin: (
    input: Iamv1alpha1.UnauthenticatedApiCreatePasswordLoginRequest,
  ) => Promise<Iamv1alpha1.Login>
  iamMemberInitiateMagicCodeLogin: (input: Iamv1alpha1.UnauthenticatedApiInitiateMagicCodeLoginRequest) => Promise<void>
  iamMemberCreateMagicCodeLogin: (
    input: Iamv1alpha1.UnauthenticatedApiCreateMagicCodeLoginRequest,
  ) => Promise<Iamv1alpha1.Login>
  iamMemberCheckLoginMFAOTP: (input: Iamv1alpha1.UnauthenticatedApiCheckLoginMFAOTPRequest) => Promise<void>
  iamMemberCommitLogin: (input: IamMemberCommitLoginInputsType) => Promise<Iamv1alpha1.CommitLoginResponse>
  logout: () => void
  authenticated: boolean
}

export declare class IamV1alpha1API extends SDKAPI {
  deleteJWT: Iamv1alpha1.API['deleteJWT']
}

export declare class IamV1alpha1UnauthenticatedAPI extends SDKAPI {
  renewJWT: Iamv1alpha1.UnauthenticatedAPI['renewJWT']

  createPasswordLogin: Iamv1alpha1.UnauthenticatedAPI['createPasswordLogin']

  initiateMagicCodeLogin: Iamv1alpha1.UnauthenticatedAPI['initiateMagicCodeLogin']

  createMagicCodeLogin: Iamv1alpha1.UnauthenticatedAPI['createMagicCodeLogin']

  checkLoginMFAOTP: Iamv1alpha1.UnauthenticatedAPI['checkLoginMFAOTP']

  commitLogin: Iamv1alpha1.UnauthenticatedAPI['commitLogin']

  initiateOAuth2Login: Iamv1alpha1.UnauthenticatedAPI['initiateOAuth2Login']

  initiateSamlLogin: Iamv1alpha1.UnauthenticatedAPI['initiateSamlLogin']

  createOAuth2Login: Iamv1alpha1.UnauthenticatedAPI['createOAuth2Login']

  searchOrganization: Iamv1alpha1.UnauthenticatedAPI['searchOrganization']
}

export declare class AccountV3UnauthenticatedAPI {
  createLoginSession: Accountv3.UnauthenticatedUserAPI['createLoginSession']

  logInOrganizations: Accountv3.UnauthenticatedUserAPI['logInOrganizations']

  initiateAuthenticationCodeLogin: Accountv3.UnauthenticatedUserAPI['initiateAuthenticationCodeLogin']

  resendAuthenticationCode: Accountv3.UnauthenticatedUserAPI['resendAuthenticationCode']

  initiateOIDCLogin: Accountv3.UnauthenticatedUserAPI['initiateOIDCLogin']

  startWebAuthnAuthentication: Accountv3.UnauthenticatedUserAPI['startWebAuthnAuthentication']
}

export type ConfigurationClientAPIs = {
  IamV1Alpha1: { new (client: SDKClient): IamV1alpha1API }
  IamUnauthenticatedV1Alpha1: {
    new (client: SDKClient): IamV1alpha1UnauthenticatedAPI
  }
  AccountV3UnauthenticatedUser: {
    new (client: SDKClient): AccountV3UnauthenticatedAPI
  }
}

export type ConfigurationClientMethods = {
  deleteJWT: Iamv1alpha1.API['deleteJWT']
  renewJWT: Iamv1alpha1.UnauthenticatedAPI['renewJWT']
  createPasswordLogin: Iamv1alpha1.UnauthenticatedAPI['createPasswordLogin']
  initiateMagicCodeLogin: Iamv1alpha1.UnauthenticatedAPI['initiateMagicCodeLogin']
  createMagicCodeLogin: Iamv1alpha1.UnauthenticatedAPI['createMagicCodeLogin']
  checkLoginMFAOTP: Iamv1alpha1.UnauthenticatedAPI['checkLoginMFAOTP']
  commitLogin: Iamv1alpha1.UnauthenticatedAPI['commitLogin']
  initiateOAuth2Login: Iamv1alpha1.UnauthenticatedAPI['initiateOAuth2Login']
  initiateSamlLogin: Iamv1alpha1.UnauthenticatedAPI['initiateSamlLogin']
  createOAuth2Login: Iamv1alpha1.UnauthenticatedAPI['createOAuth2Login']
  searchOrganization: Iamv1alpha1.UnauthenticatedAPI['searchOrganization']
  createLoginSession: Accountv3.UnauthenticatedUserAPI['createLoginSession']
  logInOrganizations: Accountv3.UnauthenticatedUserAPI['logInOrganizations']
  initiateAuthenticationCodeLogin: Accountv3.UnauthenticatedUserAPI['initiateAuthenticationCodeLogin']
  resendAuthenticationCode: Accountv3.UnauthenticatedUserAPI['resendAuthenticationCode']
  initiateOIDCLogin: Accountv3.UnauthenticatedUserAPI['initiateOIDCLogin']
  startWebAuthnAuthentication: Accountv3.UnauthenticatedUserAPI['startWebAuthnAuthentication']
}

export type ConfigAuthProvider = {
  clientSettings: Settings
} & ConfigurationClientAPIs

export type CreateTemporaryClientType = {
  getAsyncToken?: AuthScwContextType['getJwtToken']
}

export type RefreshSessionType = {
  paramsRenewRequest: Iamv1alpha1.UnauthenticatedApiRenewJWTRequest
  setJWT: (jwtInfoParam: Accountv3.LogInResponse) => void
  onError?: OnError
}

export type LoginOrganizationsInputsType = Accountv3.UnauthenticatedUserApiLogInOrganizationsRequest & {
  callback?: (result: Accountv3.LogInOrganizationsResponse) => Promise<void> | void
}

export type IamMemberCommitLoginInputsType = {
  loginId: Iamv1alpha1.Login['id']
  callback?: (jwt: Iamv1alpha1.CommitLoginResponse) => Promise<void> | void
}

export type CookieConfigType = {
  httpOnly: boolean
  path: string
  sameSite: 'lax' | 'none' | 'strict' | boolean | undefined
  secure: boolean
}
