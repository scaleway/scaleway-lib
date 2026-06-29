import { Errors } from '@scaleway/sdk-client'
import type { EncodedJWT, RefreshSessionType } from '../types'
import { AuthStoreManager } from './authStoreManager'
import { clientSingleton } from './createClient'

let refreshSessionPromise: Promise<EncodedJWT | undefined> | undefined

export const refreshSession = ({ paramsRenewRequest, setJWT, onError }: RefreshSessionType) => {
  if (refreshSessionPromise !== undefined) {
    return refreshSessionPromise
  }

  const { renewJWT } = clientSingleton.createClient({})

  refreshSessionPromise = renewJWT(paramsRenewRequest)
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
      refreshSessionPromise = undefined
    })

  return refreshSessionPromise
}

export const decodeToken = (encodedToken: string) => {
  try {
    // oxlint-disable-next-line typescript/no-unsafe-assignment
    const decodedTokenRaw = JSON.parse(atob(encodedToken))
    if (AuthStoreManager.typeGuardJWT(decodedTokenRaw)) {
      return decodedTokenRaw
    }

    return null
  } catch {
    return null
  }
}

export const encodeToken = (jwt: EncodedJWT) => btoa(JSON.stringify(jwt))
export const getCookieJWT = (audienceId: string) => AuthStoreManager.getJwt(audienceId)
