import type { LoadOptions, RudderAnalytics as RudderAnalyticsType } from '@rudderstack/analytics-js'
import type { Context, ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { CategoryKind } from '../types'

export type Analytics = RudderAnalyticsType

export type OnEventError = (error: Error) => Promise<void> | void

type EventFunction = (...args: never[]) => Promise<void> | void

export type Events = Record<string, (analytics?: Analytics, onEventError?: OnEventError) => EventFunction>

export type AnalyticsContextInterface<T extends Events = Events> = {
  analytics: Analytics | undefined
  events: { [K in keyof T]: ReturnType<T[K]> }
  isAnalyticsReady: boolean
}

export const AnalyticsContext: Context<AnalyticsContextInterface | undefined> = createContext<
  AnalyticsContextInterface | undefined
>(undefined)

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
   *  This option force provider to render children only when isAnalytics is ready, you can also set a timeout to prevent blocking indefinitely and use isAnalyticsReady to show a loading screen.
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
