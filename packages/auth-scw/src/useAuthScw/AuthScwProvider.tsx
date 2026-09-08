import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isExpired } from '../isExpired'
import type {
  AuthScwContextType,
  ConfigAuthProvider,
  CookieConfigType,
  EncodedJWT,
  OnError,
  StorageType,
} from '../types'
import { createAuthStoreManager, migrateCookieToLocalStorage } from './authStoreManager'
import type { AuthStoreManagerInstance } from './authStoreManager'
import { clientSingleton } from './createClient'
import { decodeToken, encodeToken, getStoredJWT, refreshSession } from './helpers'
import { proxyJwt } from './proxyJwt'

export type AuthProviderParamType = ConfigAuthProvider & {
  children: ReactNode
  cookieSuffix: string
  urlParamTokenName: string
  onError?: OnError
  cookieConfig?: CookieConfigType
  /**
   * Cookie max-age in seconds. Defaults to 31 days (`COOKIE_AGE`).
   */
  cookieAge?: number
  /**
   * Where to persist the JWT and audienceId.
   *
   * Defaults to `'cookie'` for backward compatibility.
   */
  storageType?: StorageType
  /**
   * When `true` and `storageType` is `'localStorage'`, any JWT/audienceId
   * previously stored in cookies will be migrated to localStorage on
   * initialization, then removed from cookies. Useful for live migrations.
   *
   * Defaults to `false`.
   */
  migrateFromCookie?: boolean
  /**
   * Custom store manager instance. When omitted, a new one is created via
   * `createAuthStoreManager({ storageType, cookieConfig, cookieAge })`.
   * Useful for testing or when you need to share a single instance across
   * multiple providers.
   */
  storeManager?: AuthStoreManagerInstance
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
  cookieAge,
  urlParamTokenName,
  onError,
  storageType = 'cookie',
  migrateFromCookie = false,
  storeManager: storeManagerProp,
}: AuthProviderParamType) => {
  const storeManager = useMemo(() => {
    const instance = storeManagerProp ?? createAuthStoreManager({ storageType, cookieConfig, cookieAge })
    instance.setStorageType(storageType)
    return instance
  }, [storeManagerProp, storageType, cookieConfig, cookieAge])

  useEffect(() => {
    clientSingleton.setAPIsAndSettings({
      clientSettings,
      IamV1Alpha1,
      IamUnauthenticatedV1Alpha1,
    })
  }, [clientSettings, IamV1Alpha1, IamUnauthenticatedV1Alpha1])
  const initAudienceId = () => {
    storeManager.setSuffixKey(cookieSuffix)

    // Live migration: cookie -> localStorage
    if (storageType === 'localStorage' && migrateFromCookie) {
      migrateCookieToLocalStorage(storeManager)
    }

    // automatic login
    const currentUrl = new URL(globalThis.location.href)
    const tokenRaw = currentUrl.searchParams.get(urlParamTokenName)

    if (tokenRaw) {
      currentUrl.searchParams.delete(urlParamTokenName)
      const token = decodeToken(tokenRaw, storeManager)
      if (token) {
        const jwtProxy = proxyJwt(token)
        if (jwtProxy.jwt) {
          storeManager.setJwt({ jwtInfo: jwtProxy })
        }

        globalThis.history.replaceState({}, '', currentUrl)

        return jwtProxy.jwt?.audienceId
      }
    }
    const audienceId = storeManager.getAudienceId()
    if (audienceId) {
      const storedJwt = storeManager.getJwt(audienceId)
      if (storedJwt) {
        return audienceId
      }
    }

    return undefined
  }

  const [currentAudienceId, setCurrentAudienceId] = useState<string | undefined>(() => initAudienceId())

  const setJWT = useCallback(
    (jwtInfoParam: EncodedJWT) => {
      const currentJWT = proxyJwt(jwtInfoParam)

      if (currentJWT.jwt?.audienceId) {
        storeManager.setJwt({ jwtInfo: currentJWT })
        setCurrentAudienceId(currentJWT.jwt.audienceId)
      }
    },
    [setCurrentAudienceId, storeManager],
  )

  const getJWT: AuthScwContextType['getJWT'] = useCallback(
    async (audienceId = currentAudienceId) => {
      if (audienceId) {
        const storedJWT = getStoredJWT(audienceId, storeManager)

        if (storedJWT?.jwt) {
          const { renewToken, token, jwt: currentJWT } = storedJWT

          if (currentJWT.expiresAt && !isExpired(new Date(currentJWT.expiresAt))) {
            return {
              jwt: currentJWT,
              renewToken,
              source: 'storage' as const,
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
    [currentAudienceId, setJWT, onError, storeManager],
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
      const storedJWT = getStoredJWT(currentAudienceId, storeManager)
      storeManager.deleteJwt(currentAudienceId)
      if (storedJWT?.jwt) {
        const { deleteJWT } = clientSingleton.createClient({
          getAsyncToken: getJwtToken,
        })
        // We try to delete the token, we kinda don't care if the request fail
        deleteJWT?.({ jti: storedJWT.jwt.jti }).catch(() => null)
      }
    }
    storeManager.deleteAudienceId()
    setCurrentAudienceId(undefined)
  }, [getJwtToken, currentAudienceId, storeManager])

  const jti = useMemo(() => {
    if (currentAudienceId) {
      const storedJWT = getStoredJWT(currentAudienceId, storeManager)

      if (storedJWT?.jwt) {
        return storedJWT.jwt.jti
      }
    }

    return undefined
  }, [currentAudienceId, storeManager])

  const isAuthenticated = useMemo(
    () => Boolean(currentAudienceId && getStoredJWT(currentAudienceId, storeManager)),
    [currentAudienceId, storeManager],
  )

  const setAudienceId = useCallback((audienceId: string | undefined) => {
    setCurrentAudienceId(audienceId)
  }, [])

  const value = useMemo(
    () => ({
      audienceId: currentAudienceId ?? undefined,
      authenticated: isAuthenticated,
      decodeToken: (encodedToken: string) => decodeToken(encodedToken, storeManager),
      encodeToken,
      getJWT,
      getJwtToken,
      jti,
      logout,
      setAudienceId,
      setJWT,
    }),
    [getJWT, getJwtToken, logout, setJWT, setAudienceId, currentAudienceId, isAuthenticated, jti, storeManager],
  )

  return <AuthScwContext value={value}>{children}</AuthScwContext>
}
