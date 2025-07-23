import type { SerializeOptions } from 'cookie'

export const THIRD_PARTY_PROVIDERS = [
  {
    name: 'Amplitude',
    displayName: 'Amplitude',
    category: 'analytics',
  },
  {
    name: 'Algolia',
    displayName: 'Algolia',
    category: 'analytics',
  },
  {
    name: 'LinkedIn',
    displayName: 'LinkedIn',
    category: 'marketing',
  },
  {
    name: 'Google Ads',
    displayName: 'Google AdWord',
    category: 'marketing',
  },
] as const

export const CATEGORIES = [
  'essential',
  'functional',
  'marketing',
  'analytics',
  'advertising',
] as const

export const destSDKBaseURL = (cdnUrl: string) =>
  `${cdnUrl}/cdn/v3/modern/js-integrations`
export const pluginsSDKBaseURL = (cdnUrl: string) =>
  `${cdnUrl}/cdn/v3/modern/plugins`

export const COOKIE_PREFIX = '_scw_rgpd'
export const HASH_COOKIE = `${COOKIE_PREFIX}_hash`

// Appx 13 Months
export const CONSENT_MAX_AGE = 13 * 30 * 24 * 60 * 60
// Appx 6 Months
export const CONSENT_ADVERTISING_MAX_AGE = 6 * 30 * 24 * 60 * 60

export const COOKIES_OPTIONS: SerializeOptions = {
  sameSite: 'strict',
  secure: true,
  path: '/',
} as const
