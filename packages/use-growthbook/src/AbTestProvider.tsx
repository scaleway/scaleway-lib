import type { Context } from '@growthbook/growthbook-react'
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react'
import { type ReactNode, useCallback, useEffect, useMemo } from 'react'
import type { Attributes, LoadConfig } from './types'

export type ToolConfig = {
  apiHost: string
  clientKey: string
  enableDevMode: boolean
}

export type TrackingCallback = NonNullable<Context['trackingCallback']>

export type AbTestProviderProps = {
  children: ReactNode
  config: ToolConfig
  trackingCallback: TrackingCallback
  errorCallback: (error: Error | string) => void
  attributes: Attributes
  loadConfig?: LoadConfig
}

const getGrowthBookInstance = ({
  config: { apiHost, clientKey, enableDevMode },
  attributes,
  trackingCallback,
}: {
  config: ToolConfig
  attributes: Attributes
  trackingCallback: TrackingCallback
}) =>
  new GrowthBook({
    apiHost,
    clientKey,
    enableDevMode,
    attributes,
    trackingCallback,
  })

const defaultLoadConfig = {
  autoRefresh: false,
  timeout: 500,
}

export const AbTestProvider = ({
  children,
  config,
  trackingCallback,
  errorCallback,
  attributes,
  loadConfig = defaultLoadConfig,
}: AbTestProviderProps) => {
  const growthbook = useMemo(
    () => getGrowthBookInstance({ config, attributes, trackingCallback }),
    [trackingCallback, config, attributes],
  )

  const loadFeature = useCallback(async () => {
    if (config.clientKey) {
      await growthbook.loadFeatures(loadConfig)
    }
  }, [growthbook, config, loadConfig])

  useEffect(() => {
    loadFeature().catch(errorCallback)
  }, [loadFeature, errorCallback])

  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  )
}
