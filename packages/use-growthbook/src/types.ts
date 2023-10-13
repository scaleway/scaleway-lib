import type { Context } from '@growthbook/growthbook-react'

export type Attributes = Record<string, string | number | undefined>

/**
 * @param {boolean} [autoRefresh] - false.
 * @param {number} [timeout] - 500.
 * @param {boolean} [skipCache] - false.
 */
export type LoadConfig = {
  autoRefresh: boolean
  timeout: number
  skipCache: boolean
}

export type ToolConfig = Pick<
  Context,
  | 'apiHost'
  | 'clientKey'
  | 'enableDevMode'
  | 'backgroundSync'
  | 'subscribeToChanges'
>

export type TrackingCallback = NonNullable<Context['trackingCallback']>

export type ErrorCallback = (error: Error | string) => void | null
