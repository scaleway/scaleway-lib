import type { ConsentOptions, LoadOptions } from '@rudderstack/analytics-js'

export const defaultConsentOptions: ConsentOptions = {
  trackConsent: true,
  discardPreConsentEvents: true,
  storage: {
    type: 'localStorage',
  },
  consentManagement: {
    enabled: true,
    allowedConsentIds: [],
    deniedConsentIds: [],
  },
} as const

export const defaultLoadOptions: LoadOptions = {
  logLevel: 'NONE',
  polyfillIfRequired: false,
  preConsent: {
    enabled: true,
    storage: {
      strategy: 'anonymousId',
    },
    events: {
      delivery: 'buffer',
    },
  },
  consentManagement: {
    enabled: true,
    provider: 'custom',
    // https://www.rudderstack.com/docs/data-governance/consent-management/custom-consent-manager/javascript/#pre-consent-user-tracking
    allowedConsentIds: [],
    deniedConsentIds: [],
  },
  queueOptions: {
    batch: {
      enabled: true,
      maxItems: 20,
      maxSize: 512 * 1024, // 512 KB
      flushInterval: 3_000, // in ms
    },
  },
  /**
   * integrations are usefull in case you do not want to load uses some destinations despites the consentManagements or if you need to change something.
   * By default it's will be set to All and we let the consent Managements system handle the load of client destinations.
   */
  integrations: {
    All: true,
  },
  loadIntegration: false,
  secureCookie: true,
  anonymousIdOptions: {
    autoCapture: {
      enabled: true,
    },
  },
  sessions: {
    autoTrack: true,
    timeout: 500,
  },
} as const
