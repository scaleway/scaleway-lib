import { Errors } from '@scaleway/sdk-client'
import type { EncodedJWT, RefreshSessionType } from '../types'
import type { AuthStoreManagerInstance } from './authStoreManager'
import { clientSingleton } from './createClient'

// Keyed by jti so concurrent renewals of different audiences each get their own audience token.
const refreshSessionPromises = new Map<string, Promise<EncodedJWT | undefined>>()

export const refreshSession = async ({ paramsRenewRequest, setJWT, onError }: RefreshSessionType) => {
  const inFlightPromise = refreshSessionPromises.get(paramsRenewRequest.jti)
  if (inFlightPromise !== undefined) {
    return inFlightPromise
  }

  const { renewJWT } = clientSingleton.createClient({})

  const refreshPromise = renewJWT(paramsRenewRequest)
    .then(jwtInfo => {
      setJWT(jwtInfo)

      return jwtInfo
    })
    .catch((error: unknown) => {
      if (onError) {
        onError({
          error,
          extra: {
            iframe: globalThis.self !== globalThis.top,
            jti: paramsRenewRequest.jti,
            message: error instanceof Errors.ScalewayError ? error.rawMessage : undefined,
            renewToken: paramsRenewRequest.renewToken,
          },
          title: 'Renew token failed',
        })
      }

      return undefined
    })
    .finally(() => {
      refreshSessionPromises.delete(paramsRenewRequest.jti)
    })

  refreshSessionPromises.set(paramsRenewRequest.jti, refreshPromise)

  return refreshPromise
}

export const decodeToken = (encodedToken: string, storeManager: AuthStoreManagerInstance) => {
  try {
    // oxlint-disable-next-line typescript/no-unsafe-assignment
    const decodedTokenRaw = JSON.parse(atob(encodedToken))
    if (storeManager.typeGuardJWT(decodedTokenRaw)) {
      return decodedTokenRaw
    }

    return null
  } catch {
    return null
  }
}

export const encodeToken = (jwt: EncodedJWT) => btoa(JSON.stringify(jwt))

export const getStoredJWT = (audienceId: string, storeManager: AuthStoreManagerInstance) =>
  storeManager.getJwt(audienceId)
