import { AnalyticsBrowser } from '@segment/analytics-next'
import type {
  Analytics,
  AnalyticsSettings,
  InitOptions,
} from '@segment/analytics-next'
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type OnEventError = (error: Error) => Promise<void> | void
type EventFunction = (...args: never[]) => Promise<void>
type Events = Record<
  string,
  (analytics?: Analytics, onEventError?: OnEventError) => EventFunction
>

interface SegmentContextInterface<T extends Events = Events> {
  analytics: Analytics | undefined
  events: { [K in keyof T]: ReturnType<T[K]> }
}

const SegmentContext = createContext<SegmentContextInterface | undefined>(
  undefined,
)

export function useSegment<T extends Events>(): SegmentContextInterface<T> {
  // @ts-expect-error Here we force cast the generic onto the useContext because the context is a
  // global variable and cannot be generic
  const context = useContext<SegmentContextInterface<T>>(SegmentContext)
  if (context === undefined) {
    throw new Error('useSegment must be used within a SegmentProvider')
  }

  return context
}

export type SegmentProviderProps<T> = {
  cdn?: string
  settings?: AnalyticsSettings
  initOptions?: InitOptions
  onError?: (err: Error) => void
  onEventError?: OnEventError
  events: T
  children: ReactNode
}

export { Analytics }

declare global {
  interface Window {
    analytics: Analytics & { _cdn: string }
  }
}

function SegmentProvider<T extends Events>({
  children,
  settings,
  initOptions,
  onError,
  onEventError,
  events,
  cdn,
}: SegmentProviderProps<T>) {
  const [internalAnalytics, setAnalytics] = useState<Analytics | undefined>(
    undefined,
  )

  if (cdn) {
    window.analytics = window.analytics ?? {}
    // https://github.com/segmentio/analytics-next/issues/362
    // eslint-disable-next-line no-underscore-dangle
    window.analytics._cdn = cdn
  }

  useEffect(() => {
    if (settings?.writeKey) {
      AnalyticsBrowser.load(settings, initOptions)
        .then(([res]) => setAnalytics(res))
        .catch((err: Error) => {
          onError?.(err)
        })
    }
  }, [onError, settings, initOptions])

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
    }
  }, [internalAnalytics, events, onEventError])

  return (
    <SegmentContext.Provider value={value}>{children}</SegmentContext.Provider>
  )
}

export default SegmentProvider
