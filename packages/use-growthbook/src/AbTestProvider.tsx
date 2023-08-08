/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// @ts-expect-error TODO: remove once Growthbook is correctly typed and export
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react'
import { type ReactNode, useCallback, useEffect, useMemo } from 'react'
import type { Attributes, GrowthBookType, LoadConfig } from './types'

export type ToolConfig = {
  apiHost: string
  clientKey: string
  enableDevMode: boolean
}

export type TrackingCallback = (
  experiment: { key: string },
  result: { key: string },
) => void

// TODO: use type from growthbook when it's typed will be export correctly
// export type TrackingCallback = NonNullable<Context['trackingCallback']>

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
}): GrowthBookType =>
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
  const growthbook: GrowthBookType = useMemo(
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
/* eslint-enable @typescript-eslint/no-unsafe-call  */
/* eslint-enable @typescript-eslint/no-unsafe-return */
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
/* eslint-enable @typescript-eslint/no-unsafe-member-access */
