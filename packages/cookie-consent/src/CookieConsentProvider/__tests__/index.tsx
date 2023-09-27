// useSegmentIntegrations tests have been splitted in multiple files because of https://github.com/facebook/jest/issues/8987
import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { act, renderHook } from '@testing-library/react'
import cookie from 'cookie'
import type { ComponentProps, ReactNode } from 'react'
import { CookieConsentProvider, useCookieConsent } from '..'

const wrapper =
  ({
    isConsentRequired,
  }: Omit<ComponentProps<typeof CookieConsentProvider>, 'children'>) =>
  ({ children }: { children: ReactNode }) => (
    <CookieConsentProvider
      isConsentRequired={isConsentRequired}
      essentialIntegrations={['Deskpro', 'Stripe', 'Sentry']}
      config={{
        segment: {
          cdnURL: 'url',
          writeKey: 'key',
        },
      }}
    >
      {children}
    </CookieConsentProvider>
  )

jest.mock('../useSegmentIntegrations', () => ({
  __esModule: true,
  useSegmentIntegrations: () => [
    {
      category: 'analytics',
      name: 'Google Universal Analytics',
    },
    {
      category: 'marketing',
      name: 'Salesforce custom destination (Scaleway)',
    },
    {
      category: 'marketing',
      name: 'Salesforce',
    },
  ],
}))

describe('CookieConsent - CookieConsentProvider', () => {
  afterEach(() => {
    document.cookie = ''
  })

  it('useCookieConsent should throw without provider', () => {
    const spy = jest.spyOn(console, 'error')
    spy.mockImplementation(() => {})

    expect(() => renderHook(() => useCookieConsent())).toThrow(
      Error('useCookieConsent must be used within a CookieConsentProvider'),
    )

    spy.mockRestore()
  })

  it('should enable everything when isConsentRequired = false', () => {
    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: wrapper({
        isConsentRequired: false,
        essentialIntegrations: ['Deskpro', 'Stripe', 'Sentry'],
        config: {
          segment: {
            cdnURL: 'url',
            writeKey: 'key',
          },
        },
      }),
    })

    expect(result.current.needConsent).toBe(false)
    expect(result.current.isSegmentAllowed).toBe(true)
    expect(result.current.categoriesConsent).toStrictEqual({
      analytics: true,
      marketing: true,
    })
    expect(result.current.segmentIntegrations).toStrictEqual({
      All: false,
      'Google Universal Analytics': true,
      Salesforce: true,
      'Salesforce custom destination (Scaleway)': true,
    })
  })

  it('should know to ask for content when no cookie is set and consent is required', () => {
    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: wrapper({
        isConsentRequired: true,
        essentialIntegrations: ['Deskpro', 'Stripe', 'Sentry'],
        config: {
          segment: {
            cdnURL: 'url',
            writeKey: 'key',
          },
        },
      }),
    })

    expect(result.current.needConsent).toBe(true)
    expect(result.current.isSegmentAllowed).toBe(false)
    expect(result.current.categoriesConsent).toStrictEqual({
      marketing: false,
      analytics: false,
    })
    expect(result.current.segmentIntegrations).toStrictEqual({
      All: false,
      'Google Universal Analytics': false,
      Salesforce: false,
      'Salesforce custom destination (Scaleway)': false,
    })
  })

  it('should save consent correctly', () => {
    const spy = jest.spyOn(cookie, 'serialize')
    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: wrapper({
        isConsentRequired: true,
        essentialIntegrations: ['Deskpro', 'Stripe', 'Sentry'],
        config: {
          segment: {
            cdnURL: 'url',
            writeKey: 'key',
          },
        },
      }),
    })

    expect(result.current.needConsent).toBe(true)
    expect(result.current.isSegmentAllowed).toBe(false)
    expect(result.current.categoriesConsent).toStrictEqual({
      analytics: false,
      marketing: false,
    })
    expect(result.current.segmentIntegrations).toStrictEqual({
      All: false,
      'Google Universal Analytics': false,
      Salesforce: false,
      'Salesforce custom destination (Scaleway)': false,
    })

    act(() => {
      result.current.saveConsent({
        advertising: true,
        marketing: true,
      })
    })

    const cookieOptions = { sameSite: 'strict', secure: true }

    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy).toHaveBeenNthCalledWith(2, '_scw_rgpd_marketing', 'true', {
      ...cookieOptions,
      maxAge: 33696000,
      path: '/',
    })
    expect(spy).toHaveBeenNthCalledWith(3, '_scw_rgpd_hash', '913003917', {
      ...cookieOptions,
      maxAge: 15552000,
      path: '/',
    })

    act(() => {
      result.current.saveConsent({
        advertising: false,
        marketing: false,
      })
    })

    expect(spy).toHaveBeenCalledTimes(6)
    expect(spy).toHaveBeenNthCalledWith(5, '_scw_rgpd_marketing', '', {
      expires: new Date(0),
    })
    expect(spy).toHaveBeenNthCalledWith(6, '_scw_rgpd_hash', '913003917', {
      ...cookieOptions,
      maxAge: 15552000,
      path: '/',
    })
  })

  it('should not need consent if hash cookie is set', () => {
    jest.spyOn(cookie, 'parse').mockReturnValue({ _scw_rgpd_hash: '913003917' })
    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: wrapper({
        isConsentRequired: true,
        essentialIntegrations: ['Deskpro', 'Stripe', 'Sentry'],
        config: {
          segment: {
            cdnURL: 'url',
            writeKey: 'key',
          },
        },
      }),
    })

    expect(result.current.needConsent).toBe(false)
    expect(result.current.isSegmentAllowed).toBe(false)
    expect(result.current.categoriesConsent).toStrictEqual({
      analytics: false,
      marketing: false,
    })
    expect(result.current.segmentIntegrations).toStrictEqual({
      All: false,
      'Google Universal Analytics': false,
      Salesforce: false,
      'Salesforce custom destination (Scaleway)': false,
    })
  })

  it('should not need consent if hash cookie is set and some categories already approved', () => {
    jest.spyOn(cookie, 'parse').mockReturnValue({
      _scw_rgpd_hash: '913003917',
      _scw_rgpd_marketing: 'true',
    })
    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: wrapper({
        isConsentRequired: true,
        essentialIntegrations: ['Deskpro', 'Stripe', 'Sentry'],
        config: {
          segment: {
            cdnURL: 'url',
            writeKey: 'key',
          },
        },
      }),
    })

    expect(result.current.needConsent).toBe(false)
    expect(result.current.isSegmentAllowed).toBe(true)
    expect(result.current.categoriesConsent).toStrictEqual({
      analytics: false,
      marketing: true,
    })
    expect(result.current.segmentIntegrations).toStrictEqual({
      All: false,
      'Google Universal Analytics': false,
      Salesforce: true,
      'Salesforce custom destination (Scaleway)': true,
    })
  })
})
