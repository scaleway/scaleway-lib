// eslint-disable-next-line no-abusive-eslint-disable
/* oxlint-disable */
import { API as ParentAPI } from '@scaleway/sdk-client'
import type { Iamv1alpha1 } from '@scaleway/sdk-iam'

export type JWT = Iamv1alpha1.JWT
export type EncodedJWT = Iamv1alpha1.EncodedJWT
export type DeleteJWTRequest = Iamv1alpha1.DeleteJWTRequest

export type UnauthenticatedApiRenewJWTRequest = {
  /**
   * The JWT ID of the JWT to renew.
   */
  jti: string
  /**
   * The renew token associated to the JWT to renew.
   */
  renewToken: string
}

/**
 * IAM API.

This API allows you to manage Identity and Access Management (IAM) across your Scaleway Organizations, Projects and resources.
 */
export declare class API extends ParentAPI {
  /**
   * Delete a JWT.
   *
   * @param request - The request {@link DeleteJWTRequest}
   */
  deleteJWT: (request: Readonly<DeleteJWTRequest>) => Promise<void>
}

/**
 * Unauthenticated API.
 */
export declare class UnauthenticatedAPI extends ParentAPI {
  /**
   * Renew a JWT.
   *
   * @param request - The request {@link UnauthenticatedApiRenewJWTRequest}
   * @returns A Promise of EncodedJWT
   */
  renewJWT: (request: Readonly<UnauthenticatedApiRenewJWTRequest>) => Promise<EncodedJWT>
}
