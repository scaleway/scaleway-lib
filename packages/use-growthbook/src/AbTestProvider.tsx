import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react'
import { type ReactNode, useCallback, useEffect, useMemo } from 'react'
import type {
  Attributes,
  ErrorCallback,
  LoadConfig,
  ToolConfig,
  TrackingCallback,
} from './types'

type AbTestProviderProps = {
  children: ReactNode
  config: ToolConfig
  trackingCallback: TrackingCallback
  errorCallback: ErrorCallback
  attributes: Attributes
  loadConfig?: LoadConfig
}

const defaultLoadConfig: LoadConfig = {
  autoRefresh: false,
  timeout: 500,
  skipCache: false,
} as const

const getGrowthBookInstance = ({
  config: {
    apiHost,
    clientKey,
    enableDevMode,
    backgroundSync,
    subscribeToChanges,
  },
  trackingCallback,
}: {
  config: ToolConfig
  trackingCallback: TrackingCallback
}) =>
  new GrowthBook({
    apiHost,
    clientKey,
    enableDevMode,
    trackingCallback,
    backgroundSync,
    subscribeToChanges,
  })

export const AbTestProvider = ({
  children,
  config,
  trackingCallback,
  errorCallback,
  attributes,
  loadConfig,
}: AbTestProviderProps) => {
  const growthbook = useMemo(
    () => getGrowthBookInstance({ config, trackingCallback }),
    [trackingCallback, config],
  )

  const loadFeature = useCallback(async () => {
    if (config.clientKey) {
      await growthbook.loadFeatures(loadConfig ?? defaultLoadConfig)
    }
  }, [growthbook, config, loadConfig])

  useEffect(() => {
    loadFeature().catch(errorCallback)
  }, [loadFeature, errorCallback])

  // avoid multiple instances of growthbook when attributes of the Providers changes.
  useEffect(() => {
    const currentAttributes = growthbook.getAttributes()
    if (currentAttributes !== attributes) {
      growthbook
        .setAttributes({
          ...currentAttributes,
          ...attributes,
        })
        .catch(errorCallback)
    }
  }, [attributes, growthbook, errorCallback])

  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  )
}
