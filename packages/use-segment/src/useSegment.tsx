import { Analytics, AnalyticsBrowser } from '@segment/analytics-next'
import React, {
  FunctionComponent,
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

interface SegmentContextInteface {
  analytics: Analytics | undefined
  events: Record<string, unknown>
  writeKey?: string
  onError?: (err: Error) => void
}

const initialContext = {
  analytics: undefined,
  events: {},
  onError: () => undefined,
  writeKey: undefined,
}

const SegmentContext = createContext<SegmentContextInteface>(initialContext)

export const useSegment = (): SegmentContextInteface => {
  const context = useContext(SegmentContext)
  if (context === undefined) {
    throw new Error('useSegment must be used within a SegmentProvider')
  }

  return context
}

export type SegmentProviderProps = {
  writeKey?: string
  onError: (err: Error) => void
  events: Record<string, unknown>
}

const SegmentProvider: FunctionComponent<SegmentProviderProps> = ({
  children,
  writeKey,
  onError,
  events,
}): ReactElement => {
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

  const value = useMemo<SegmentContextInteface>(
    () => ({
      analytics,
      events,
    }),
    [analytics, events],
  )

  return (
    <SegmentContext.Provider value={value}>{children}</SegmentContext.Provider>
  )
}

export default SegmentProvider
