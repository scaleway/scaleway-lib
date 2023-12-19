import { AnalyticsBrowser } from '@segment/analytics-next'
import type {
  Analytics,
  AnalyticsBrowserSettings,
  InitOptions,
} from '@segment/analytics-next'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'

export type OnEventError = (error: Error) => Promise<void> | void
type EventFunction = (...args: never[]) => Promise<void>
type Events = Record<
  string,
  (analytics?: Analytics, onEventError?: OnEventError) => EventFunction
>

type SegmentContextInterface<T extends Events = Events> = {
  analytics: Analytics | undefined
  events: { [K in keyof T]: ReturnType<T[K]> }
  isAnalyticsReady: boolean
}

const SegmentContext = createContext<SegmentContextInterface | undefined>(
  undefined,
)

export function useSegment<T extends Events>(): SegmentContextInterface<T> {
  const context = useContext<SegmentContextInterface<T> | undefined>(
    // @ts-expect-error Here we force cast the generic onto the useContext because the context is a
    // global variable and cannot be generic
    SegmentContext,
  )
  if (context === undefined) {
    throw new Error('useSegment must be used within a SegmentProvider')
  }

  return context
}

export type SegmentProviderProps<T> = {
  settings?: AnalyticsBrowserSettings
  initOptions?: InitOptions
  onError?: (err: Error) => void
  onEventError?: OnEventError
  events: T
  children: ReactNode
}

export type { Analytics }

function SegmentProvider<T extends Events>({
  children,
  settings,
  initOptions,
  onError,
  onEventError,
  events,
}: SegmentProviderProps<T>) {
  const [isAnalyticsReady, setIsAnalyticsReady] = useState(false)
  const [internalAnalytics, setAnalytics] = useState<Analytics | undefined>(
    undefined,
  )

  const shouldLoad = useMemo(() => {
    if (settings !== undefined && initOptions !== undefined) {
      const hasNoIntegrationsSettings = !initOptions.integrations
      const isAllEnabled = !!initOptions.integrations?.All
      const isAnyIntegrationEnabled = Object.values(
        initOptions.integrations ?? {},
      ).reduce<boolean>((acc, integration) => !!acc || !!integration, false)

      return (
        !!settings.writeKey &&
        (hasNoIntegrationsSettings || isAllEnabled || isAnyIntegrationEnabled)
      )
    }

    // If options or settings are undefined, we don't know if we should load or not
    // (For example, in case segment integrations are still loading)
    return undefined
  }, [initOptions, settings])

  useDeepCompareEffectNoCheck(() => {
    if (shouldLoad === true && settings) {
      AnalyticsBrowser.load(settings, initOptions)
        .then(([res]) => {
          setAnalytics(res)
        })
        .catch((err: Error) => {
          onError?.(err)
        })
        .finally(() => {
          setIsAnalyticsReady(true)
        })
    } else if (shouldLoad === false) {
      // When user has refused tracking, set ready anyway
      setIsAnalyticsReady(true)
    }
  }, [onError, settings, initOptions, shouldLoad])

  const value = useMemo<SegmentContextInterface<T>>(() => {
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

  return (
    <SegmentContext.Provider value={value}>{children}</SegmentContext.Provider>
  )
}

export default SegmentProvider
