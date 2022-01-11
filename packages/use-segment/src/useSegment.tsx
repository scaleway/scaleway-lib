import { Analytics, AnalyticsBrowser } from '@segment/analytics-next'
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type EventFunction = (...args: unknown[]) => Promise<void>
type Events = Record<string, (analytics?: Analytics) => EventFunction>

interface SegmentContextInterface<T extends Events = Events> {
  analytics: Analytics | undefined
  events: { [K in keyof T]: ReturnType<T[K]> }
  writeKey?: string
  onError?: (err: Error) => void
}

const initialContext = {
  analytics: undefined,
  events: {},
  onError: () => undefined,
  writeKey: undefined,
}

const SegmentContext = createContext<SegmentContextInterface>(initialContext)

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
  writeKey?: string
  onError: (err: Error) => void
  events: T
  children: ReactNode
}

function SegmentProvider<T extends Events>({
  children,
  writeKey,
  onError,
  events,
}: SegmentProviderProps<T>) {
  const [analytics, setAnalytics] = useState<Analytics | undefined>(undefined)

  useEffect(() => {
    if (writeKey) {
      const loadAnalytics = async () => {
        const [response] = await AnalyticsBrowser.load({ writeKey })

        return response
      }
      loadAnalytics()
        .then(res => setAnalytics(res))
        .catch((err: Error) => {
          onError(err)
        })
    }
  }, [onError, writeKey])

  const value = useMemo<SegmentContextInterface<T>>(() => {
    const curiedEvents = Object.entries(events).reduce(
      (acc, [eventName, eventFn]) => ({
        ...acc,
        [eventName]: eventFn(analytics),
      }),
      {},
    ) as { [K in keyof T]: ReturnType<T[K]> }

    return {
      analytics,
      events: curiedEvents,
    }
  }, [analytics, events])

  return (
    <SegmentContext.Provider value={value}>{children}</SegmentContext.Provider>
  )
}

export default SegmentProvider
