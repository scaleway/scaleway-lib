import { useEffect, useState } from 'react'
import type { AnalyticsConfig, AnalyticsIntegration, Config } from '../types'

const timeout = (time: number) => {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), time * 1000)

  return controller
}

const transformConfigToDestinations = (
  config: AnalyticsConfig,
): AnalyticsIntegration[] => {
  const { destinations } = config.source

  const integrations = destinations.map(
    ({ destinationDefinition, config: { consentManagement } }) => ({
      name: destinationDefinition.name,
      displayName: destinationDefinition.displayName,
      consents: consentManagement.flatMap(({ consents }) =>
        consents.map(({ consent }) => consent),
      ),
    }),
  )

  return integrations
}

/**
 * Return only Client/Hybrid destinations, Cloud Mode destinations will not be return.
 * Should be the most important as only theses destinations will load a script and set an external cookies.
 * Will return undefined if loading, empty array if no response or error, response else.
 */
export const useDestinations = (config: Config) => {
  const [destinations, setDestinations] = useState<
    AnalyticsIntegration[] | undefined
  >(undefined)

  useEffect(() => {
    const fetchDestinations = async () => {
      if (config.analytics?.cdnURL && config.analytics.writeKey) {
        const url = `${config.analytics.cdnURL}/sourceConfig`
        const WRITE_KEY = window.btoa(`${config.analytics.writeKey}:`)
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Basic ${WRITE_KEY}`,
          },
          // We'd rather have an half consent than no consent at all
          signal: timeout(10).signal,
        })
        if (!response.ok) {
          throw new Error('Failed to fetch integrations from source')
        }
        const json = (await response.json()) as AnalyticsConfig

        return transformConfigToDestinations(json)
      }

      return []
    }

    fetchDestinations()
      .then(response => {
        setDestinations(response)
      })
      .catch(() => {
        setDestinations([])
      })
      .finally(() => {
        setDestinations([])
      })
  }, [setDestinations, config.analytics])

  return {
    destinations,
    isLoaded: destinations !== undefined,
  }
}
