import type { SerializeOptions } from 'cookie'

export const THIRD_PARTY_PROVIDERS = [
  {
    category: 'analytics',
    displayName: 'Amplitude',
    name: 'Amplitude',
  } as const,
  {
    category: 'analytics',
    displayName: 'Algolia',
    name: 'Algolia',
  } as const,
  {
    category: 'marketing',
    displayName: 'LinkedIn',
    name: 'LinkedIn',
  } as const,
  {
    category: 'marketing',
    displayName: 'Google AdWord',
    name: 'Google Ads',
  } as const,
] as const

export const CATEGORIES = [
  'essential',
  'functional',
  'marketing',
  'analytics',
  'advertising',
] as const

export const destSDKBaseURL = (cdnUrl: string): string =>
  `${cdnUrl}/cdn/v3/modern/js-integrations` as const
export const pluginsSDKBaseURL = (cdnUrl: string): string =>
  `${cdnUrl}/cdn/v3/modern/plugins` as const

export const COOKIE_PREFIX: string = '_scw_rgpd' as const
export const HASH_COOKIE: string = `${COOKIE_PREFIX}_hash` as const

// Appx 13 Months
export const CONSENT_MAX_AGE: number = 13 * 30 * 24 * 60 * 60
// Appx 6 Months
export const CONSENT_ADVERTISING_MAX_AGE: number = 6 * 30 * 24 * 60 * 60

export const COOKIES_OPTIONS: SerializeOptions = {
  path: '/',
  sameSite: 'strict',
  secure: true,
} as const
