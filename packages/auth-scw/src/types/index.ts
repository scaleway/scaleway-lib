import type { Client as SDKClient, Settings } from '@scaleway/sdk-client'
import { API as SDKAPI } from '@scaleway/sdk-client'
import type { z } from 'zod'
import type { audienceIdSchema, jwtSchema } from '../zodSchemas'
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
  logout: () => void
  authenticated: boolean
}

export declare class IamV1alpha1API extends SDKAPI {
  deleteJWT: Iamv1alpha1.API['deleteJWT']
}

export declare class IamV1alpha1UnauthenticatedAPI extends SDKAPI {
  renewJWT: Iamv1alpha1.UnauthenticatedAPI['renewJWT']
}

export type ConfigurationClientAPIs = {
  IamV1Alpha1: { new (client: SDKClient): IamV1alpha1API }
  IamUnauthenticatedV1Alpha1: {
    new (client: SDKClient): IamV1alpha1UnauthenticatedAPI
  }
}

export type ConfigurationClientMethods = {
  deleteJWT: Iamv1alpha1.API['deleteJWT']
  renewJWT: Iamv1alpha1.UnauthenticatedAPI['renewJWT']
}

export type ConfigAuthProvider = {
  clientSettings: Settings
} & ConfigurationClientAPIs

export type CreateTemporaryClientType = {
  getAsyncToken?: AuthScwContextType['getJwtToken']
}

export type RefreshSessionType = {
  paramsRenewRequest: Iamv1alpha1.UnauthenticatedApiRenewJWTRequest
  setJWT: (jwtInfoParam: EncodedJWT) => void
  onError?: OnError
}

export type CookieConfigType = {
  httpOnly: boolean
  path: string
  sameSite: 'lax' | 'none' | 'strict' | boolean | undefined
  secure: boolean
}
