// eslint-disable-next-line no-abusive-eslint-disable
/* oxlint-disable */
import { API as ParentAPI } from '@scaleway/sdk-client'

export type JWT = {
  /**
   * JWT ID.
   */
  jti: string
  /**
   * ID of the user who issued the JWT.
   */
  issuerId: string
  /**
   * ID of the user targeted by the JWT.
   */
  audienceId: string
  /**
   * Creation date of the JWT.
   */
  createdAt?: Date
  /**
   * Last update date of the JWT.
   */
  updatedAt?: Date
  /**
   * Expiration date of the JWT.
   */
  expiresAt?: Date
  /**
   * IP address used during the creation of the JWT.
   */
  ip: string
  /**
   * User-agent used during the creation of the JWT.
   */
  userAgent: string
}

export type EncodedJWT = {
  /**
   * The renewed JWT.
   */
  jwt?: JWT
  /**
   * The encoded token of the renewed JWT.
   */
  token: string
  /**
   * The encoded renew token. This token is necessary to renew the JWT.
   */
  renewToken: string
}

export type DeleteJWTRequest = {
  /**
   * JWT ID of the JWT to delete.
   */
  jti: string
}

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
