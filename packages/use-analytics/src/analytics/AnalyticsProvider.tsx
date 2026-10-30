import { RudderAnalytics } from '@rudderstack/analytics-js'
import type { JSX } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'
import { destSDKBaseURL, pluginsSDKBaseURL } from '../constants'
import { defaultConsentOptions, defaultLoadOptions, defaultTimeout } from './constants'
import { normalizeIdsMigration } from './normalizeIdsMigration'
import { AnalyticsContext } from './useAnalytics'
import type { Analytics, AnalyticsContextInterface, AnalyticsProviderProps, Events } from './useAnalytics'

export const AnalyticsProvider = <T extends Events>({
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
}: AnalyticsProviderProps<T>): JSX.Element => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [internalAnalytics, setInternalAnalytics] = useState<Analytics | undefined>(undefined)

  // Analytics can be explicitly disabled: the consumer mounts the provider with a `settings`
  // object that has no `writeKey` (e.g. `config.analytics = null`). In that case there is
  // nothing to load and no `analytics.ready()` to ever wait for, so analytics is considered
  // ready immediately — otherwise consumers rendering children on `isAnalyticsReady` (or on
  // `shouldRenderOnlyWhenReady`) stay blocked until the readiness timeout fires.
  //
  // We only treat an explicitly provided but empty `settings` as disabled. An undefined
  // `settings` is ambiguous (the consumer may resolve it later, e.g. once consent is given),
  // so it keeps the previous behaviour.
  const isAnalyticsDisabled = settings !== undefined && !settings.writeKey
  const isAnalyticsReady = isLoaded || isAnalyticsDisabled

  // This effect will unlock the case where we have a failure with the load of the analytics.load as rudderstack doesn't provider any solution for this case.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined = undefined
    if (!isAnalyticsReady && (Number.isFinite(timeout) || shouldRenderOnlyWhenReady)) {
      timer = setTimeout(() => {
        setIsLoaded(true)
        onError?.(new Error('Timeout'))
      }, timeout ?? defaultTimeout)
    }

    if (isAnalyticsReady) {
      clearTimeout(timer)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isAnalyticsReady, shouldRenderOnlyWhenReady, timeout, onError])

  const shouldLoad = useMemo(() => {
    if (needConsent) {
      return false
    }

    return Boolean(settings?.writeKey)
  }, [settings?.writeKey, needConsent])

  useDeepCompareEffectNoCheck(() => {
    if (shouldLoad && settings) {
      const analytics = new RudderAnalytics()

      analytics.load(settings.writeKey, settings.cdnURL, {
        ...defaultLoadOptions,
        configUrl: settings.cdnURL,
        destSDKBaseURL: destSDKBaseURL(settings.cdnURL),
        onLoaded: (rudderAnalytics: Analytics) => {
          rudderAnalytics.consent({
            ...defaultConsentOptions,
            consentManagement: {
              allowedConsentIds: allowedConsents,
              deniedConsentIds: deniedConsents,
              enabled: true,
            },
          })
          normalizeIdsMigration(analytics)

          onLoaded(rudderAnalytics)
          setInternalAnalytics(analytics)
        },
        pluginsSDKBaseURL: pluginsSDKBaseURL(settings.cdnURL),
        ...loadOptions,
      })

      analytics.ready(() => {
        /**
         * this will wait for client destination to be ready, but analytics is ready.
         * we can listen for RSA_Ready event to know when the analytics is ready if we don't want to wait for the client destination to be ready.
         * document.addEventListener('RSA_Ready', function(e) {
         *  console.log('RSA_Ready', e.detail.analyticsInstance);
         * });
         */
        setIsLoaded(true)
      })
    }
  }, [settings, loadOptions, shouldLoad])

  const value = useMemo<AnalyticsContextInterface<T>>(() => {
    const curiedEvents = Object.fromEntries(
      Object.entries(events).map(([eventName, eventFn]) => [eventName, eventFn(internalAnalytics, onEventError)]),
    ) as { [K in keyof T]: ReturnType<T[K]> }

    return {
      analytics: internalAnalytics,
      events: curiedEvents,
      isAnalyticsReady,
    }
  }, [events, internalAnalytics, isAnalyticsReady, onEventError])

  const shouldRender = isAnalyticsDisabled || !shouldRenderOnlyWhenReady || (isAnalyticsReady && !needConsent)

  useDeepCompareEffectNoCheck(() => {
    internalAnalytics?.consent({
      consentManagement: {
        allowedConsentIds: allowedConsents,
        deniedConsentIds: deniedConsents,
        enabled: true,
      },
    })
  }, [allowedConsents, deniedConsents])

  return <AnalyticsContext.Provider value={value}>{shouldRender ? children : null}</AnalyticsContext.Provider>
}

export default AnalyticsProvider
