import type { SingleXOR } from '@scaleway/types'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { isExpired } from '../isExpired'
import type { AuthScwContextType, ConfigAuthProvider, CookieOptions, EncodedJWT, OnError } from '../types'
import { createAuthStoreManager } from './authStoreManager'
import { clientSingleton } from './createClient'
import { decodeToken, encodeToken, getStoredJWT, refreshSession } from './helpers'
import { proxyJwt } from './proxyJwt'

type CookieStorageOptions = {
  storageType?: 'cookie'
  cookie: CookieOptions
}

type LocalStorageOptions = {
  storageType: 'localStorage'
  cookie?: CookieOptions
}

export type AuthProviderParamType = ConfigAuthProvider & {
  children: ReactNode
  urlParamTokenName: string
  onError?: OnError
  /**
   * When `true` and `storageType` is `'localStorage'`, any JWT/audienceId
   * previously stored in cookies will be migrated to localStorage on
   * initialization, then removed from cookies. Useful for live migrations.
   *
   * Defaults to `false`.
   */
  migrateFromCookie?: boolean
} & SingleXOR<CookieStorageOptions, LocalStorageOptions>

const AuthScwContext = createContext<AuthScwContextType>({} as AuthScwContextType)

export const useAuthScw = () => useContext(AuthScwContext)

export const AuthScwProvider = ({
  clientSettings,
  IamV1Alpha1,
  IamUnauthenticatedV1Alpha1,
  children,
  cookie,
  urlParamTokenName,
  onError,
  storageType = 'cookie',
  migrateFromCookie = false,
}: AuthProviderParamType) => {
  const storeManager = useMemo(
    () =>
      createAuthStoreManager({
        storageType,
        cookieConfig: cookie?.config,
        cookieAge: cookie?.age,
        suffixKey: cookie?.suffix,
      }),
    [storageType, cookie?.config, cookie?.age, cookie?.suffix],
  )

  clientSingleton.setAPIsAndSettings({
    clientSettings,
    IamV1Alpha1,
    IamUnauthenticatedV1Alpha1,
  })

  const initAudienceId = () => {
    // Live migration: cookie -> localStorage
    if (storageType === 'localStorage' && migrateFromCookie) {
      storeManager.migrateCookieToLocalStorage()
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
        deleteJWT({ jti: storedJWT.jwt.jti }).catch(() => null)
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
      storeManager,
    }),
    [getJWT, getJwtToken, logout, setJWT, setAudienceId, currentAudienceId, isAuthenticated, jti, storeManager],
  )

  return <AuthScwContext value={value}>{children}</AuthScwContext>
}
