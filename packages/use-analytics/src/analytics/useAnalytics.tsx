import { RudderAnalytics } from '@rudderstack/analytics-js'
import type { LoadOptions } from '@rudderstack/analytics-js'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'
import { destSDKBaseURL, pluginsSDKBaseURL } from '../constants'
import type { CategoryKind } from '../types'
import { defaultConsentOptions, defaultLoadOptions } from './constants'
import { normalizeIdsMigration } from './normalizeIdsMigration'
import { userMigrationsTraits } from './segments/userMigrationsTraits'

type Analytics = RudderAnalytics
export type { Analytics }

export type OnEventError = (error: Error) => Promise<void> | void

type EventFunction = (...args: never[]) => Promise<void> | void
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
   *  This option force provider to render children only when isAnalytics is ready
   */
  shouldRenderOnlyWhenReady?: boolean
  /**
   * used with shouldRenderOnlyWhenReady can blocked rendering until consent the first time. You can also set a timeout to prevent blocking indefinitely.
   */
  needConsent?: boolean
  timeout?: number
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
  needConsent = true,
  onError,
  onEventError,
  allowedConsents,
  deniedConsents,
  events,
  onLoaded,
  timeout,
}: AnalyticsProviderProps<T>) {
  const [isAnalyticsReady, setIsAnalyticsReady] = useState(false)
  const [internalAnalytics, setAnalytics] = useState<Analytics | undefined>(
    undefined,
  )

  // This effect will unlock the case where we have a failure with the load of the analytics.load as rudderstack doesn't provider any solution for this case.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    if (!isAnalyticsReady && !internalAnalytics && timeout) {
      if (shouldRenderOnlyWhenReady) {
        timer = setTimeout(() => setIsAnalyticsReady(true), timeout)
        onError?.(new Error('Analytics Setup Timeout'))
      }
    }

    return () => {
      clearTimeout(timer)
    }
  }, [
    isAnalyticsReady,
    internalAnalytics,
    setIsAnalyticsReady,
    shouldRenderOnlyWhenReady,
    timeout,
    onError,
  ])

  const shouldLoad = useMemo(() => {
    if (needConsent) {
      return false
    }

    return !!settings?.writeKey
  }, [settings?.writeKey, needConsent])

  useDeepCompareEffectNoCheck(() => {
    if (shouldLoad && settings) {
      const analytics = new RudderAnalytics()

      analytics.load(settings.writeKey, settings.cdnURL, {
        ...defaultLoadOptions,
        configUrl: settings.cdnURL,
        destSDKBaseURL: destSDKBaseURL(settings.cdnURL),
        pluginsSDKBaseURL: pluginsSDKBaseURL(settings.cdnURL),
        onLoaded: (rudderAnalytics: Analytics) => {
          userMigrationsTraits(rudderAnalytics)
          normalizeIdsMigration(rudderAnalytics)

          rudderAnalytics.consent({
            ...defaultConsentOptions,
            consentManagement: {
              enabled: true,
              allowedConsentIds: allowedConsents,
              deniedConsentIds: deniedConsents,
            },
          })

          onLoaded(rudderAnalytics)

          setIsAnalyticsReady(true)
        },
        ...loadOptions,
      })

      analytics.ready(() => {
        setAnalytics(analytics)
        setIsAnalyticsReady(true)
      })
    }
  }, [settings, loadOptions, shouldLoad])

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

  const shouldRender =
    !shouldRenderOnlyWhenReady || (isAnalyticsReady && !needConsent)

  useDeepCompareEffectNoCheck(() => {
    internalAnalytics?.consent({
      consentManagement: {
        enabled: true,
        allowedConsentIds: allowedConsents,
        deniedConsentIds: deniedConsents,
      },
    })
  }, [allowedConsents, deniedConsents])

  return (
    <AnalyticsContext.Provider value={value}>
      {shouldRender ? children : null}
    </AnalyticsContext.Provider>
  )
}

export default AnalyticsProvider
