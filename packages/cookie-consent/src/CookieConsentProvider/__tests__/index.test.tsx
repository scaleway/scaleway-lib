// useSegmentIntegrations tests have been splitted in multiple files because of https://github.com/facebook/vi/issues/8987
import { act, renderHook } from '@testing-library/react'
import cookie from 'cookie'
import type { ComponentProps, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { CookieConsentProvider, useCookieConsent } from '..'
import type { Integrations } from '../types'
import type { useSegmentIntegrations } from '../useSegmentIntegrations'

const wrapper =
  ({
    isConsentRequired,
  }: Omit<
    ComponentProps<typeof CookieConsentProvider>,
    'children' | 'essentialIntegrations' | 'config'
  >) =>
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

const integrations: Integrations = [
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
]

const mockUseSegmentIntegrations = vi.fn<
  () => ReturnType<typeof useSegmentIntegrations>
>(() => ({
  integrations,
  isLoaded: true,
}))

vi.mock('../useSegmentIntegrations', () => ({
  useSegmentIntegrations: () => mockUseSegmentIntegrations(),
}))

describe('CookieConsent - CookieConsentProvider', () => {
  it('useCookieConsent should throw without provider', () => {
    const spy = vi.spyOn(console, 'error')
    spy.mockImplementation(() => {})

    expect(() => renderHook(() => useCookieConsent())).toThrow(
      new Error('useCookieConsent must be used within a CookieConsentProvider'),
    )

    spy.mockRestore()
  })

  it('should enable everything when isConsentRequired = false', () => {
    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: wrapper({
        isConsentRequired: false,
      }),
    })

    expect(result.current.needConsent).toBe(false)
    expect(result.current.isSegmentAllowed).toBe(true)
    expect(result.current.categoriesConsent).toStrictEqual({
      analytics: true,
      marketing: true,
    })
    expect(result.current.segmentIntegrations).toStrictEqual({
      'Google Universal Analytics': true,
      Salesforce: true,
      'Salesforce custom destination (Scaleway)': true,
    })
    expect(result.current.isSegmentIntegrationsLoaded).toBe(true)
  })

  it('should know when integrations are loading', () => {
    // simulate that Segment is loading
    mockUseSegmentIntegrations.mockReturnValueOnce({
      integrations: undefined,
      isLoaded: false,
    })
    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: wrapper({
        isConsentRequired: true,
      }),
    })

    expect(mockUseSegmentIntegrations).toBeCalledTimes(1)
    expect(result.current.isSegmentIntegrationsLoaded).toBe(false)
  })

  it('should know to ask for content when no cookie is set and consent is required', () => {
    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: wrapper({
        isConsentRequired: true,
      }),
    })

    expect(result.current.needConsent).toBe(true)
    expect(result.current.isSegmentAllowed).toBe(false)
    expect(result.current.categoriesConsent).toStrictEqual({
      marketing: false,
      analytics: false,
    })
    expect(result.current.segmentIntegrations).toStrictEqual({
      'Google Universal Analytics': false,
      Salesforce: false,
      'Salesforce custom destination (Scaleway)': false,
    })
  })

  it('should save consent correctly', () => {
    const spy = vi.spyOn(cookie, 'serialize')
    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: wrapper({
        isConsentRequired: true,
      }),
    })

    expect(result.current.needConsent).toBe(true)
    expect(result.current.isSegmentAllowed).toBe(false)
    expect(result.current.categoriesConsent).toStrictEqual({
      analytics: false,
      marketing: false,
    })
    expect(result.current.segmentIntegrations).toStrictEqual({
      'Google Universal Analytics': false,
      Salesforce: false,
      'Salesforce custom destination (Scaleway)': false,
    })

    act(() => {
      result.current.saveConsent({
        analytics: true,
        marketing: true,
      })
    })

    const cookieOptions = { sameSite: 'strict', secure: true, path: '/' }

    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy).toHaveBeenNthCalledWith(2, '_scw_rgpd_marketing', 'true', {
      ...cookieOptions,
      maxAge: 33696000,
    })
    expect(spy).toHaveBeenNthCalledWith(3, '_scw_rgpd_hash', '913003917', {
      ...cookieOptions,
      maxAge: 15552000,
    })

    act(() => {
      expect(result.current.categoriesConsent).toStrictEqual({
        analytics: true,
        marketing: true,
      })
    })

    act(() => {
      expect(result.current.isSegmentAllowed).toBe(true)
    })

    act(() => {
      result.current.saveConsent({
        advertising: false,
        marketing: false,
      })
    })

    expect(spy).toHaveBeenCalledTimes(6)
    expect(spy).toHaveBeenNthCalledWith(5, '_scw_rgpd_marketing', '', {
      ...cookieOptions,
      expires: new Date(0),
    })
    expect(spy).toHaveBeenNthCalledWith(6, '_scw_rgpd_hash', '913003917', {
      ...cookieOptions,
      maxAge: 15552000,
    })
  })

  it('should not need consent if hash cookie is set', () => {
    vi.spyOn(cookie, 'parse').mockImplementation(() => ({
      _scw_rgpd_hash: '913003917',
    }))
    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: wrapper({
        isConsentRequired: true,
      }),
    })

    expect(result.current.needConsent).toBe(false)
    expect(result.current.isSegmentAllowed).toBe(false)
    expect(result.current.categoriesConsent).toStrictEqual({
      analytics: false,
      marketing: false,
    })
    expect(result.current.segmentIntegrations).toStrictEqual({
      'Google Universal Analytics': false,
      Salesforce: false,
      'Salesforce custom destination (Scaleway)': false,
    })
  })

  it('should not need consent if hash cookie is set and some categories already approved', () => {
    vi.spyOn(cookie, 'parse').mockImplementation(() => ({
      _scw_rgpd_hash: '913003917',
      _scw_rgpd_marketing: 'true',
    }))

    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: wrapper({
        isConsentRequired: true,
      }),
    })

    expect(result.current.needConsent).toBe(false)
    expect(result.current.isSegmentAllowed).toBe(true)
    expect(result.current.categoriesConsent).toStrictEqual({
      analytics: false,
      marketing: true,
    })
    expect(result.current.segmentIntegrations).toStrictEqual({
      'Google Universal Analytics': false,
      Salesforce: true,
      'Salesforce custom destination (Scaleway)': true,
    })
  })

  it('should return integration All: false in case there is no integrations', () => {
    mockUseSegmentIntegrations.mockReturnValue({
      integrations: [],
      isLoaded: true,
    })
    const { result } = renderHook(() => useCookieConsent(), {
      wrapper: wrapper({
        isConsentRequired: true,
      }),
    })

    expect(mockUseSegmentIntegrations).toBeCalledTimes(2)

    expect(result.current.segmentIntegrations).toStrictEqual({
      All: false,
    })
  })
})
