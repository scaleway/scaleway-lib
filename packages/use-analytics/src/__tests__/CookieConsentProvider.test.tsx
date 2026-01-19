import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CookieConsentProvider,
  useCookieConsent,
} from '../cookies-consent/CookieConsentProvider'
import type { Config } from '../types'

// Mock dependencies
vi.mock(import('../analytics/useDestinations'), async importOriginal => {
  const originalModule = await importOriginal()

  return {
    ...originalModule,
    useDestinations: () => ({
      destinations: [],
      isLoaded: true,
    }),
  }
})

vi.mock('../helpers/isClient', () => ({
  IS_CLIENT: true,
}))

vi.mock('../constants', () => ({
  CATEGORIES: ['essential', 'functional', 'analytics', 'advertising'] as const,
  CONSENT_ADVERTISING_MAX_AGE: 2_592_000,
  CONSENT_MAX_AGE: 31_536_000,
  COOKIE_PREFIX: 'consent',
  COOKIES_OPTIONS: { path: '/', sameSite: 'lax' },
  HASH_COOKIE: 'consent_hash',
}))

vi.mock('../helpers/misc', () => ({
  stringToHash: vi.fn((str: string) => `hash_${str}`),
}))

const TestComponent = () => {
  const { allowedConsents, deniedConsents, categoriesConsent } =
    useCookieConsent()

  return (
    <div>
      <div data-testid="allowed-consents">{allowedConsents.join(',')}</div>
      <div data-testid="denied-consents">{deniedConsents.join(',')}</div>
      <div data-testid="categories-consent">
        {Object.entries(categoriesConsent).map(([cat, consent]) => (
          <div key={cat} data-testid={`consent-${cat}`}>
            {consent ? 'true' : 'false'}
          </div>
        ))}
      </div>
    </div>
  )
}

describe('allowedConsents and deniedConsents', () => {
  const mockConfig: Config = {
    analytics: {
      writeKey: 'test-key',
      cdnURL: 'https://cdn.example.com',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should have all consents allowed when consent is not required', () => {
    render(
      <CookieConsentProvider isConsentRequired={false} config={mockConfig}>
        <TestComponent />
      </CookieConsentProvider>,
    )

    expect(screen.getByTestId('allowed-consents').textContent).toBe(
      'essential,functional,analytics,advertising',
    )
    expect(screen.getByTestId('denied-consents').textContent).toBe('')
  })

  it('should have all consents denied when consent is required and no cookies exist', () => {
    render(
      <CookieConsentProvider isConsentRequired config={mockConfig}>
        <TestComponent />
      </CookieConsentProvider>,
    )

    expect(screen.getByTestId('allowed-consents').textContent).toBe('')
    expect(screen.getByTestId('denied-consents').textContent).toBe(
      'essential,functional,analytics,advertising',
    )
  })

  it('should correctly categorize consents based on cookie values', () => {
    // Create the cookie string array with 'consent_' prefix
    const cookieArray = [
      'consent_essential=true',
      'consent_functional=false',
      'consent_marketing=false',
      'consent_analytics=true',
      'consent_advertising=false',
    ] as const

    // Join to create cookie string
    const cookieString = cookieArray.join('; ')

    vi.spyOn(document, 'cookie', 'get').mockReturnValueOnce(cookieString)

    render(
      <CookieConsentProvider isConsentRequired config={mockConfig}>
        <TestComponent />
      </CookieConsentProvider>,
    )

    expect(screen.getByTestId('allowed-consents').textContent).toBe(
      'essential,analytics',
    )
    expect(screen.getByTestId('denied-consents').textContent).toBe(
      'functional,advertising',
    )
  })

  it('should handle undefined consent values as false', () => {
    // Set some cookies with undefined values analytics and advertising are missing (undefined)
    const cookieArray = [
      'consent_essential=false',
      'consent_functional=false',
    ] as const

    // Join to create cookie string
    const cookieString = cookieArray.join('; ')

    vi.spyOn(document, 'cookie', 'get').mockReturnValueOnce(cookieString)

    render(
      <CookieConsentProvider isConsentRequired config={mockConfig}>
        <TestComponent />
      </CookieConsentProvider>,
    )

    expect(screen.getByTestId('allowed-consents').textContent).toBe('')
    expect(screen.getByTestId('denied-consents').textContent).toBe(
      'essential,functional,analytics,advertising',
    )
  })

  it('should handle partial consent updates correctly', async () => {
    // Set some cookies with undefined values analytics and advertising are missing (undefined)
    const cookieArray = [
      'consent_essential=true',
      'consent_functional=true',
      'consent_analytics=false',
      'consent_advertising=false',
      'consent_undefined=false',
    ] as const

    // Join to create cookie string
    const cookieString = cookieArray.join('; ')

    vi.spyOn(document, 'cookie', 'get').mockReturnValueOnce(cookieString)

    const TestComponentWithPartialSave = () => {
      const { allowedConsents, deniedConsents, saveConsent } =
        useCookieConsent()

      const handlePartialSave = () => {
        saveConsent({
          analytics: true, // Only change this one
        })
      }

      return (
        <div>
          <div data-testid="allowed-consents">{allowedConsents.join(',')}</div>
          <div data-testid="denied-consents">{deniedConsents.join(',')}</div>
          <button
            type="button"
            onClick={handlePartialSave}
            data-testid="save-partial"
          >
            Save Partial
          </button>
        </div>
      )
    }

    render(
      <CookieConsentProvider isConsentRequired config={mockConfig}>
        <TestComponentWithPartialSave />
      </CookieConsentProvider>,
    )

    // Initial state
    expect(screen.getByTestId('allowed-consents').textContent).toBe(
      'essential,functional',
    )
    expect(screen.getByTestId('denied-consents').textContent).toBe(
      'analytics,advertising',
    )
  })
})
