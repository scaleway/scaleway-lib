import { RudderAnalytics } from '@rudderstack/analytics-js'
import type { LoadOptions } from '@rudderstack/analytics-js'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'
import { destSDKBaseURL, pluginsSDKBaseURL } from '../constants'
import type { CategoryKind } from '../types'
import { defaultConsentOptions, defaultLoadOptions } from './constants'
import { trackLink } from './segments/trackLink'
import type { TrackLink } from './segments/trackLink'
import { userMigrationsTraits } from './segments/userMigrationsTraits'

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
  }
  loadOptions?: LoadOptions

  /**
   * This option help you in case you don't want to load analytics
   */
  shouldLoadAnalytics?: boolean
  /**
   *  // This option force provider to render children only when isAnalytics is ready
   */
  shouldRenderOnlyWhenReady?: boolean
  allowedConsents: CategoryKind[]
  deniedConsents: CategoryKind[]
  onError?: (err: Error) => void
  onEventError?: OnEventError
  events: T
  children: ReactNode
  /**
   * This can be used to set consentManagement or modify the config
   */
  onLoaded: (analytics: Analytics) => void
}

export function AnalyticsProvider<T extends Events>({
  children,
  settings,
  loadOptions,
  shouldRenderOnlyWhenReady = false,
  shouldLoadAnalytics = false,
  onError,
  onEventError,
  allowedConsents,
  deniedConsents,
  events,
}: AnalyticsProviderProps<T>) {
  const [isAnalyticsReady, setIsAnalyticsReady] = useState(false)
  const [internalAnalytics, setAnalytics] = useState<Analytics | undefined>(
    undefined,
  )

  const shouldLoad = useMemo(() => {
    if (shouldLoadAnalytics) {
      return !!settings?.writeKey
    }

    return false
  }, [shouldLoadAnalytics, settings?.writeKey])

  useDeepCompareEffectNoCheck(() => {
    if (shouldLoad && settings) {
      const analytics = new RudderAnalytics()

      analytics.load(settings.writeKey, settings.cdnURL, {
        ...defaultLoadOptions,
        destSDKBaseURL: destSDKBaseURL(settings.cdnURL),
        pluginsSDKBaseURL: pluginsSDKBaseURL(settings.cdnURL),
        onLoaded: (rudderAnalytics: Analytics) => {
          userMigrationsTraits(rudderAnalytics)

          rudderAnalytics.consent({
            ...defaultConsentOptions,
            consentManagement: {
              enabled: true,
              allowedConsentIds: allowedConsents,
              deniedConsentIds: deniedConsents,
            },
          })

          setIsAnalyticsReady(true)
        },
        ...loadOptions,
      })

      analytics.ready(() => {
        // @ts-expect-error blabla
        setAnalytics({ ...analytics, trackLink: trackLink(analytics) })
        setIsAnalyticsReady(true)
      })
    } else if (shouldLoadAnalytics && !shouldLoad) {
      // When user has refused tracking, set ready anyway
      setIsAnalyticsReady(true)
    }
  }, [onError, settings, loadOptions, shouldLoad, shouldLoadAnalytics])

  useEffect(() => {
    if (isAnalyticsReady) {
      internalAnalytics?.consent({
        consentManagement: {
          allowedConsentIds: allowedConsents,
          deniedConsentIds: deniedConsents,
        },
      })
    }
  }, [internalAnalytics, isAnalyticsReady, allowedConsents, deniedConsents])

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
