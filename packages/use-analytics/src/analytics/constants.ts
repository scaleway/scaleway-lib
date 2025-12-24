import type { ConsentOptions, LoadOptions } from '@rudderstack/analytics-js'

export const defaultTimeout = 5000

export const defaultConsentOptions: ConsentOptions = {
  consentManagement: {
    allowedConsentIds: [],
    deniedConsentIds: [],
    enabled: true,
  },
  /**
   * The discardPreConsentEvents parameter in RudderStack's JavaScript SDK determines what happens to events that are generated before the user provides consent (pre-consent events):
   */
  discardPreConsentEvents: false,
  storage: {
    type: 'cookieStorage',
  },
  trackConsent: false,
} as const

export const defaultLoadOptions: LoadOptions = {
  anonymousIdOptions: {
    autoCapture: {
      enabled: true,
      source: 'segment',
    },
  },
  consentManagement: {
    // https://www.rudderstack.com/docs/data-governance/consent-management/custom-consent-manager/javascript/#pre-consent-user-tracking
    allowedConsentIds: [],
    deniedConsentIds: [],
    enabled: true,
    provider: 'custom',
  },
  /**
   * integrations are usefull in case you do not want to load uses some destinations despites the consentManagements or if you need to change something.
   * By default it's will be set to All and we let the consent Managements system handle the load of client destinations.
   */
  integrations: {
    All: true,
  },
  loadIntegration: true,
  logLevel: 'NONE',
  polyfillIfRequired: false,
  preConsent: {
    enabled: true,
    events: {
      delivery: 'buffer',
    },
    storage: {
      strategy: 'anonymousId',
    },
  },
  queueOptions: {
    batch: {
      enabled: true,
      flushInterval: 3_000, // in ms
      maxItems: 20,
      maxSize: 512 * 1024, // 512 KB
    },
  },
  secureCookie: true,
  sessions: {
    autoTrack: true,
    // 30 minutes
    timeout: 30 * 60 * 1000,
  },
} as const
