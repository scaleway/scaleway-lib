import { RudderAnalytics } from '@rudderstack/analytics-js'
import type { LoadOptions } from '@rudderstack/analytics-js'
import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'
import { trackLink } from './segments/trackLink'
import type { TrackLink } from './segments/trackLink'
import { CDN_URL, SEGMENT_COOKIES_KEY, destSDKBaseURL, pluginsSDKBaseURL } from './constants'

type Analytics = RudderAnalytics & {
  trackLink: TrackLink
}

export type { Analytics }

export type OnEventError = (error: Error) => Promise<void> | void

type EventFunction = (...args: never[]) => Promise<void>
type Events = Record<
  string,
  (analytics?: Analytics, onEventError?: OnEventError) => EventFunction
>

type AnalyticsContextInterface<T extends Events = Events> = {
  analytics: Analytics | undefined
  events: { [K in keyof T]: ReturnType<T[K]> }
  isAnalyticsReady: boolean
}

const AnalyticsContext = createContext<AnalyticsContextInterface | undefined>(
  undefined,
)

export function useAnalytics<T extends Events>(): AnalyticsContextInterface<T> {
  const context = useContext<AnalyticsContextInterface<T> | undefined>(
    // @ts-expect-error Here we force cast the generic onto the useContext because the context is a
    // global variable and cannot be generic
    AnalyticsContext,
  )
  if (context === undefined) {
    throw new Error('useAnalytics must be used within a AnalyticsProvider')
  }

  return context
}

export type AnalyticsProviderProps<T> = {
  settings?: {
    writeKey: string
    cdnURL: string
    timeout: number
  }
  initOptions?: LoadOptions
  areOptionsLoaded?: boolean
  shouldRenderOnlyWhenReady?: boolean
  onError?: (err: Error) => void
  onEventError?: OnEventError
  events: T
  children: ReactNode
}

// const CDN_URL = 'https://nuage02.scaleway.com'

function AnalyticsProvider<T extends Events>({
  children,
  settings,
  initOptions,
  areOptionsLoaded = false,
  // This option force provider to render children only when isAnalytics is ready
  shouldRenderOnlyWhenReady = false,
  onError,
  onEventError,
  events,
}: AnalyticsProviderProps<T>) {
  const [isAnalyticsReady, setIsAnalyticsReady] = useState(false)
  const [internalAnalytics, setAnalytics] = useState<Analytics | undefined>(
    undefined,
  )

  const shouldLoad = useMemo(() => {
    if (areOptionsLoaded) {
      const hasNoIntegrationsSettings = !initOptions?.integrations
      const isAllEnabled = !!initOptions?.integrations?.All
      const isAnyIntegrationEnabled = Object.values(
        initOptions?.integrations ?? {},
      ).reduce<boolean>((acc, integration) => !!acc || !!integration, false)

      return (
        !!settings?.writeKey &&
        (hasNoIntegrationsSettings || isAllEnabled || isAnyIntegrationEnabled)
      )
    }

    // If options are not loaded, we should not load
    return false
  }, [initOptions?.integrations, areOptionsLoaded, settings?.writeKey])

  useDeepCompareEffectNoCheck(() => {
    if (areOptionsLoaded && shouldLoad && settings) {
      const analytics = new RudderAnalytics()
      const int = {
        ALL: false,
        HOTJAR: false,
      }
      const allowedConsentIds = ['Analytics', 'Marketing', 'TOTO', 'TITI']
      const deniedConsentIds = ['']

      analytics.load(settings.writeKey, settings.cdnURL, {
        logLevel: 'DEBUG',
        polyfillIfRequired: false,
        queueOptions: {
          batch: {
            enabled: true,
            maxItems: 20,
            maxSize: 512 * 1024, // 512 KB
            flushInterval: 3_000, // in ms
          },
        },
        anonymousIdOptions: {
          autoCapture: {
            enabled: true,
          },
        },
        sessions: {
          autoTrack: true,
          timeout: 500,
        },
        onLoaded: (rudderanalytics: Analytics) => {
          const segmentAnonymousId = localStorage.getItem(
            SEGMENT_COOKIES_KEY.ANONYMOUS_ID,
          )
          const segmentUserId = localStorage.getItem(
            SEGMENT_COOKIES_KEY.USER_ID,
          )
          const segmentGroupId = localStorage.getItem(
            SEGMENT_COOKIES_KEY.GROUP_ID,
          )
          const rudderUserId = rudderanalytics.getUserId()
          const rudderGroupId = rudderanalytics.getGroupId()

          if (segmentAnonymousId) {
            rudderanalytics.setAnonymousId(segmentAnonymousId)
          }

          if (
            segmentUserId &&
            (!rudderUserId || rudderUserId != segmentUserId)
          ) {
            rudderanalytics.identify(segmentUserId)
          }

          if (
            segmentGroupId &&
            (!rudderGroupId || rudderGroupId !== segmentGroupId)
          ) {
            rudderanalytics.group(segmentGroupId)
          }

          analytics?.consent({
            trackConsent: true,
            discardPreConsentEvents: true, // Optional; default value is false
            storage: {
              type: 'localStorage',
            },
            consentManagement: {
              enabled: true,
              allowedConsentIds,
              deniedConsentIds,
            },
            integrations: int,
          })


          setIsAnalyticsReady(true)
        },
        destSDKBaseURL,
        pluginsSDKBaseURL,
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
          // TODO: https://www.rudderstack.com/docs/data-governance/consent-management/custom-consent-manager/javascript/#pre-consent-user-tracking
          allowedConsentIds,
          deniedConsentIds,
        },

        // ...initOptions,
        integrations: int,
      })

      analytics.ready(() => {
        // @ts-expect-error blabla
        setAnalytics({ ...analytics, trackLink: trackLink(analytics) })
        setIsAnalyticsReady(true)
      })
    } else if (areOptionsLoaded && !shouldLoad) {
      // When user has refused tracking, set ready anyway
      // setIsAnalyticsReady(true)
    }
  }, [onError, settings, initOptions, shouldLoad, areOptionsLoaded])

  const value = useMemo<AnalyticsContextInterface<T>>(() => {
    const curiedEvents = Object.entries(events).reduce(
      (acc, [eventName, eventFn]) => ({
        ...acc,
        [eventName]: eventFn(internalAnalytics, onEventError),
      }),
      {},
    ) as { [K in keyof T]: ReturnType<T[K]> }

    return {
      analytics: internalAnalytics,
      events: curiedEvents,
      isAnalyticsReady,
    }
  }, [events, internalAnalytics, isAnalyticsReady, onEventError])

  const shouldRender = !shouldRenderOnlyWhenReady || isAnalyticsReady

  return (
    <AnalyticsContext.Provider value={value}>
      {shouldRender ? children : null}
    </AnalyticsContext.Provider>
  )
}

export default AnalyticsProvider
