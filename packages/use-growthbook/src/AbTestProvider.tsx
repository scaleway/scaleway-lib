/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error TODO: remove once Growthbook is correctly typed and export
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import type { GrowthBookType } from './types'

export type ToolConfig = {
  apiHost: string
  clientKey: string
  enableDevMode: boolean
}

export type TrackingCallback = (
  experiment: { key: string },
  result: { key: string },
) => null

export type AbTestProviderProps = {
  children: ReactNode
  anonymousId: string
  config: ToolConfig
  trackingCallback: TrackingCallback
  errorCallback: (error: string) => null
}

const getGrowthBookInstance = ({
  config: { apiHost, clientKey, enableDevMode },
  anonymousId,
  trackingCallback,
}: {
  config: ToolConfig
  anonymousId: string
  trackingCallback: TrackingCallback
}): GrowthBookType =>
  new GrowthBook({
    apiHost,
    clientKey,
    enableDevMode,
    attributes: {
      anonymousId,
      userId: undefined,
      organizationId: undefined,
      organizationType: undefined,
    },
    trackingCallback,
  })
export const AbTestProvider = ({
  children,
  config,
  anonymousId,
  trackingCallback,
  errorCallback,
}: AbTestProviderProps) => {
  const growthbook: GrowthBookType = useMemo(
    () => getGrowthBookInstance({ config, anonymousId, trackingCallback }),
    [trackingCallback, config, anonymousId],
  )

  const loadFeature = useCallback(async () => {
    if (config.clientKey) {
      await growthbook.loadFeatures({
        autoRefresh: false,
        timeout: 500,
      })
    }
  }, [growthbook, config])

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
