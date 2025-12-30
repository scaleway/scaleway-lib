import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react'
import type { ComponentType, ReactNode } from 'react'
import { useCallback, useEffect, useMemo } from 'react'
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
  skipCache: false,
  timeout: 500,
} as const

type GetGrowthBookInstanceProps = {
  config: ToolConfig
  trackingCallback: TrackingCallback
}

const getGrowthBookInstance = ({
  config: { apiHost, clientKey, enableDevMode },
  trackingCallback,
}: GetGrowthBookInstanceProps) =>
  new GrowthBook({
    apiHost,
    clientKey,
    enableDevMode,
    trackingCallback,
  })

export const AbTestProvider: ComponentType<AbTestProviderProps> = ({
  children,
  config,
  trackingCallback,
  errorCallback,
  attributes,
  loadConfig,
}) => {
  const growthbook = useMemo(
    () => getGrowthBookInstance({ config, trackingCallback }),
    [trackingCallback, config],
  )

  const loadFeature = useCallback(async () => {
    if (config.clientKey) {
      const initConfig = {
        ...defaultLoadConfig,
        ...loadConfig,
      }
      await growthbook.init(initConfig)
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
