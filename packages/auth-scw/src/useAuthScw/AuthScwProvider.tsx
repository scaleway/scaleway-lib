import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { isExpired } from '../isExpired'
import type { AuthScwContextType, ConfigAuthProvider, EncodedJWT, OnError, CookieConfigType } from '../types'
import { AuthStoreManager, setCookieConfig } from './authStoreManager'
import { clientSingleton } from './createClient'
import { decodeToken, encodeToken, getCookieJWT, refreshSession } from './helpers'
import { proxyJwt } from './proxyJwt'

export type AuthProviderParamType = ConfigAuthProvider & {
  children: ReactNode
  cookieSuffix: string
  urlParamTokenName: string
  onError?: OnError
  cookieConfig?: CookieConfigType
}

const AuthScwContext = createContext<AuthScwContextType>({} as AuthScwContextType)

export const useAuthScw = () => useContext(AuthScwContext)

export const AuthScwProvider = ({
  clientSettings,
  IamV1Alpha1,
  IamUnauthenticatedV1Alpha1,
  children,
  cookieSuffix,
  cookieConfig,
  urlParamTokenName,
  onError,
}: AuthProviderParamType) => {
  if (cookieConfig) setCookieConfig(cookieConfig)
  clientSingleton.setAPIsAndSettings({
    clientSettings,
    IamV1Alpha1,
    IamUnauthenticatedV1Alpha1,
  })
  const initAudienceId = useCallback(() => {
    AuthStoreManager.setSuffixKey(cookieSuffix)

    // automatic login
    const currentUrl = new URL(globalThis.location.href)
    const tokenRaw = currentUrl.searchParams.get(urlParamTokenName)

    if (tokenRaw) {
      currentUrl.searchParams.delete(urlParamTokenName)
      const token = decodeToken(tokenRaw)
      if (token) {
        const jwtProxy = proxyJwt(token)
        if (jwtProxy.jwt) {
          AuthStoreManager.setJwt({ jwtInfo: jwtProxy })
        }

        globalThis.history.replaceState({}, '', currentUrl)

        return jwtProxy.jwt?.audienceId
      }
    }
    const audienceId = AuthStoreManager.getAudienceId()
    if (audienceId) {
      const cookieJwt = AuthStoreManager.getJwt(audienceId)
      if (cookieJwt) {
        return audienceId
      }
    }

    return undefined
  }, [cookieSuffix, urlParamTokenName])

  const [currentAudienceId, setCurrentAudienceId] = useState<string | undefined>(() => initAudienceId())

  const setJWT = useCallback(
    (jwtInfoParam: EncodedJWT) => {
      const currentJWT = proxyJwt(jwtInfoParam)

      if (currentJWT.jwt?.audienceId) {
        AuthStoreManager.setJwt({ jwtInfo: currentJWT })
        setCurrentAudienceId(currentJWT.jwt.audienceId)
      }
    },
    [setCurrentAudienceId],
  )

  const getJWT: AuthScwContextType['getJWT'] = useCallback(
    async (audienceId = currentAudienceId) => {
      if (audienceId) {
        const cookieJWT = getCookieJWT(audienceId)

        if (cookieJWT?.jwt) {
          const { renewToken, token, jwt: currentJWT } = cookieJWT

          if (currentJWT.expiresAt && !isExpired(new Date(currentJWT.expiresAt))) {
            return {
              jwt: currentJWT,
              renewToken,
              source: 'cookie' as const,
              token,
            }
          }

          const jwtInfoData = await refreshSession({
            onError,
            paramsRenewRequest: {
              jti: currentJWT.jti,
              renewToken,
            },
            setJWT,
          })

          if (jwtInfoData) {
            return {
              jwt: jwtInfoData.jwt,
              renewToken: jwtInfoData.renewToken,
              source: 'refreshSession' as const,
              token: jwtInfoData.token,
            }
          }
        }
      }

      return undefined
    },
    [currentAudienceId, setJWT, onError],
  )

  const getJwtToken: AuthScwContextType['getJwtToken'] = useCallback(
    async (audienceId?: string) => {
      const currentJWT = await getJWT(audienceId)
      if (currentJWT) {
        return currentJWT.token
      }

      return undefined
    },
    [getJWT],
  )

  const logout: AuthScwContextType['logout'] = useCallback(() => {
    if (currentAudienceId) {
      const cookieJWT = getCookieJWT(currentAudienceId)
      AuthStoreManager.deleteJwt(currentAudienceId)
      if (cookieJWT?.jwt) {
        const { deleteJWT } = clientSingleton.createClient({
          getAsyncToken: getJwtToken,
        })
        // We try to delete the token, we kinda don't care if the request fail
        deleteJWT?.({ jti: cookieJWT.jwt.jti }).catch(() => null)
      }
    }
    AuthStoreManager.deleteAudienceId()
    setCurrentAudienceId(undefined)
  }, [getJwtToken, currentAudienceId])

  const jti = useMemo(() => {
    if (currentAudienceId) {
      const cookieJWT = getCookieJWT(currentAudienceId)

      if (cookieJWT?.jwt) {
        return cookieJWT.jwt.jti
      }
    }

    return undefined
  }, [currentAudienceId])

  const isAuthenticated = useMemo(() => !!(currentAudienceId && getCookieJWT(currentAudienceId)), [currentAudienceId])

  const setAudienceId = useCallback((audienceId: string | undefined) => {
    setCurrentAudienceId(audienceId)
  }, [])

  const value = useMemo(
    () => ({
      audienceId: currentAudienceId ?? undefined,
      authenticated: isAuthenticated,
      decodeToken,
      encodeToken,
      getJWT,
      getJwtToken,
      jti,
      logout,
      setAudienceId,
      setJWT,
    }),
    [getJWT, getJwtToken, logout, setJWT, setAudienceId, currentAudienceId, isAuthenticated, jti],
  )

  return <AuthScwContext value={value}>{children}</AuthScwContext>
}
