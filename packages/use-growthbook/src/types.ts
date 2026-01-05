import type { Context, GrowthBook } from '@growthbook/growthbook-react'

export type Attributes = Record<string, string | number | undefined>

/**
 * @param {boolean} [autoRefresh] - false.
 * @param {number} [timeout] - 500.
 * @param {boolean} [skipCache] - false.
 */
export type LoadConfig = NonNullable<Parameters<GrowthBook['init']>[0]>

export type ToolConfig = Pick<
  Context,
  'apiHost' | 'clientKey' | 'enableDevMode' | 'debug' | 'stickyBucketService'
>

export type TrackingCallback = NonNullable<Context['trackingCallback']>

export type ErrorCallback = (error: Error | string) => void | null
