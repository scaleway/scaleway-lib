import { API, createClient } from '@scaleway/sdk-client'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MOCK_AUDIENCE_ID, MOCK_ENCODED_JWT_COOKIE } from '../../mocks/index'
import { AuthScwProvider, useAuthScw } from '../useAuthScw/AuthScwProvider'
import type { AuthProviderParamType } from '../useAuthScw/AuthScwProvider'
import { AuthStoreManager, setStorageType } from '../useAuthScw/authStoreManager'

const mockDeleteJwt = vi.fn(() => Promise.resolve())
const mockRenewJwt = vi.fn(() => Promise.resolve(MOCK_ENCODED_JWT_COOKIE))

const DEFAULT_COOKIE_SUFFIX = 'test'

class IamV1Alpha1 extends API {
  deleteJWT = mockDeleteJwt
}

class IamUnauthenticatedV1Alpha1 extends API {
  renewJWT = mockRenewJwt
}

const createWrapper =
  (overrides: Partial<AuthProviderParamType> = {}) =>
  ({ children }: { children: ReactNode }) => {
    const client = createClient()

    return (
      <AuthScwProvider
        IamV1Alpha1={IamV1Alpha1}
        IamUnauthenticatedV1Alpha1={IamUnauthenticatedV1Alpha1}
        clientSettings={client.settings}
        cookieSuffix={DEFAULT_COOKIE_SUFFIX}
        cookieConfig={{
          httpOnly: false,
          path: '/',
          sameSite: 'strict',
          secure: false,
        }}
        urlParamTokenName={'token'}
        {...overrides}
      >
        {children}
      </AuthScwProvider>
    )
  }

const Wrapper = createWrapper()

const { location } = globalThis
const defaultURL = new URL(globalThis.location.href)

const resetStorage = () => {
  setStorageType('cookie')
  AuthStoreManager.setSuffixKey(DEFAULT_COOKIE_SUFFIX)
  AuthStoreManager.deleteAllJwts()
  AuthStoreManager.deleteAudienceId()
  globalThis.localStorage.clear()
}

describe('useauthscw provider', () => {
  beforeEach(() => {
    resetStorage()
    // Allow reset of the url, as globalThis.replaceState is not trully mocked
    // type force is resolving a typescript bug
    globalThis.location = location as Location & string
    globalThis.location.href = defaultURL.href
  })

  describe('useauthscwscw hook', () => {
    it('should check initialvalues', () => {
      const { result } = renderHook(useAuthScw, { wrapper: Wrapper })

      expect(result.current.audienceId).toBeUndefined()
      expect(result.current.authenticated).toBe(false)
    })

    it('should inject a token within cookie at login if token url param is present', async () => {
      const mockReplaceStateHistory = vi.fn()

      const currentUrl = new URL(globalThis.location.href)

      currentUrl.searchParams.set('token', btoa(JSON.stringify(MOCK_ENCODED_JWT_COOKIE)))

      globalThis.location.href = currentUrl.href

      // @note replaceState doesn't work on jsdom / happy-dom.
      // TODO: Need to find a proper mock to test that replaceState remove token params
      globalThis.history.replaceState = mockReplaceStateHistory

      const { result } = renderHook(useAuthScw, { wrapper: Wrapper })

      expect(mockReplaceStateHistory).toHaveBeenCalledTimes(1)

      expect(result.current.audienceId).toStrictEqual(MOCK_ENCODED_JWT_COOKIE.jwt.audienceId)

      const currentJWT = await result.current.getJWT()
      expect(currentJWT?.jwt?.jti).toStrictEqual(MOCK_ENCODED_JWT_COOKIE.jwt.jti)
      expect(currentJWT?.source).toBe('cookie')

      expect(result.current.audienceId).toBe(MOCK_AUDIENCE_ID)
      //  uncommented when replaceState is trully mock.
      // expect(globalThis.location.href).toEqual('')
    })
  })

  describe('useauthscwscw methods', () => {
    it('should check initialvalues when logged', async () => {
      AuthStoreManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })

      const { result } = renderHook(useAuthScw, { wrapper: Wrapper })

      expect(result.current.audienceId).toStrictEqual(MOCK_AUDIENCE_ID)
      expect(result.current.authenticated).toBe(true)

      const currentJwt = await result.current.getJWT()
      expect(currentJwt?.token).toStrictEqual(MOCK_ENCODED_JWT_COOKIE.token)
      expect(currentJwt?.renewToken).toStrictEqual(MOCK_ENCODED_JWT_COOKIE.renewToken)
      // already initialized and not outdated.
      expect(currentJwt?.source).toBe('cookie')
    })

    it('should setjwt correctly', async () => {
      const { result } = renderHook(useAuthScw, { wrapper: Wrapper })
      act(() => {
        result.current.setJWT(MOCK_ENCODED_JWT_COOKIE)
      })

      await act(async () => {
        expect(result.current.audienceId).toStrictEqual(MOCK_AUDIENCE_ID)
        await expect(result.current.getJwtToken()).resolves.toStrictEqual(MOCK_ENCODED_JWT_COOKIE.token)
      })
    })

    it('should renew jwt correctly', async () => {
      AuthStoreManager.setSuffixKey(DEFAULT_COOKIE_SUFFIX)
      AuthStoreManager.setJwt({
        jwtInfo: {
          ...MOCK_ENCODED_JWT_COOKIE,
          jwt: {
            ...MOCK_ENCODED_JWT_COOKIE.jwt,
            expiresAt: new Date(),
          },
        },
      })

      const { result } = renderHook(useAuthScw, { wrapper: Wrapper })

      await waitFor(async () => {
        const currentJWT = await result.current.getJWT()
        expect(currentJWT?.source).toBe('refreshSession')
      })

      expect(mockRenewJwt).toHaveBeenCalledTimes(1)
    })

    it('should fail to renew jwt', async () => {
      mockRenewJwt.mockRejectedValueOnce(new Error('Renew failed'))

      AuthStoreManager.setSuffixKey(DEFAULT_COOKIE_SUFFIX)
      AuthStoreManager.setJwt({
        jwtInfo: {
          ...MOCK_ENCODED_JWT_COOKIE,
          jwt: {
            ...MOCK_ENCODED_JWT_COOKIE.jwt,
            expiresAt: new Date(),
          },
        },
      })

      const { result } = renderHook(useAuthScw, { wrapper: Wrapper })

      await waitFor(async () => {
        const currentJWT = await result.current.getJWT()
        expect(currentJWT).toBeUndefined()
      })

      expect(mockRenewJwt).toHaveBeenCalledTimes(1)
    })

    it('should logout and clear all', async () => {
      AuthStoreManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })
      // set another random audienceID
      AuthStoreManager.setJwt({
        jwtInfo: {
          ...MOCK_ENCODED_JWT_COOKIE,
          jwt: {
            ...MOCK_ENCODED_JWT_COOKIE.jwt,
            audienceId: 'random',
          },
        },
      })

      const { result } = renderHook(useAuthScw, { wrapper: Wrapper })

      act(() => {
        result.current.logout()
      })

      await waitFor(() => {
        expect(result.current.authenticated).toBe(false)
      })
      expect(mockDeleteJwt).toHaveBeenCalledTimes(1)
      await waitFor(() => {
        expect(result.current.audienceId).toBeUndefined()
      })
    })
  })

  describe('storageType', () => {
    it('should work with localStorage as storage backend', async () => {
      const wrapper = createWrapper({ storageType: 'localStorage' })

      const { result } = renderHook(useAuthScw, { wrapper })

      act(() => {
        result.current.setJWT(MOCK_ENCODED_JWT_COOKIE)
      })

      await act(async () => {
        expect(result.current.audienceId).toStrictEqual(MOCK_AUDIENCE_ID)
        await expect(result.current.getJwtToken()).resolves.toStrictEqual(MOCK_ENCODED_JWT_COOKIE.token)
      })

      // Data should be persisted in localStorage, not in cookies
      setStorageType('cookie')
      expect(AuthStoreManager.getJwt(MOCK_AUDIENCE_ID)).toBeNull()
      setStorageType('localStorage')
      expect(AuthStoreManager.getJwt(MOCK_AUDIENCE_ID)).not.toBeNull()
    })

    it('should migrate from cookie to localStorage on init when migrateFromCookie is true', () => {
      // Seed cookie before mounting the provider
      setStorageType('cookie')
      AuthStoreManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })

      // Sanity: cookie has data, localStorage does not
      expect(AuthStoreManager.getJwt(MOCK_AUDIENCE_ID)).not.toBeNull()
      setStorageType('localStorage')
      expect(AuthStoreManager.getJwt(MOCK_AUDIENCE_ID)).toBeNull()

      const wrapper = createWrapper({ storageType: 'localStorage', migrateFromCookie: true })
      const { result } = renderHook(useAuthScw, { wrapper })

      // The provider should have migrated the JWT to localStorage
      expect(result.current.audienceId).toStrictEqual(MOCK_AUDIENCE_ID)
      expect(result.current.authenticated).toBe(true)

      // localStorage now has the jwt
      setStorageType('localStorage')
      expect(AuthStoreManager.getJwt(MOCK_AUDIENCE_ID)).not.toBeNull()

      // Cookie has been cleaned
      setStorageType('cookie')
      expect(AuthStoreManager.getJwt(MOCK_AUDIENCE_ID)).toBeNull()
      expect(AuthStoreManager.getAudienceId()).toBeNull()
    })

    it('should not migrate when migrateFromCookie is false', () => {
      setStorageType('cookie')
      AuthStoreManager.setJwt({ jwtInfo: MOCK_ENCODED_JWT_COOKIE })

      const wrapper = createWrapper({ storageType: 'localStorage', migrateFromCookie: false })
      const { result } = renderHook(useAuthScw, { wrapper })

      // No migration, the provider does not know about the cookie JWT
      expect(result.current.audienceId).toBeUndefined()
      expect(result.current.authenticated).toBe(false)

      // Cookie is still intact
      setStorageType('cookie')
      expect(AuthStoreManager.getJwt(MOCK_AUDIENCE_ID)).not.toBeNull()
    })
  })
})
