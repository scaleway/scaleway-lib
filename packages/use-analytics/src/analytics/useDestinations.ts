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

  const dest = destinations.map(
    ({ destinationDefinition, config: { consentManagement } }) => ({
      consents: consentManagement.flatMap(({ consents }) =>
        consents.map(({ consent }) => consent),
      ),
      displayName: destinationDefinition.displayName,
      name: destinationDefinition.name,
    }),
  )

  return dest
}

/**
 * Return only Client/Hybrid destinations, Cloud Mode destinations will not be return.
 * Should be the most important as only theses destinations will load a script and set an external cookies.
 * Will return undefined if loading, empty array if no response or error, response else.
 */
export const useDestinations = (
  config: Config,
): {
  destinations: AnalyticsIntegration[] | undefined
  isLoaded: boolean
} => {
  const [destinations, setDestinations] = useState<
    AnalyticsIntegration[] | undefined
  >(undefined)

  // TODO: use useDataloader to add more cache.
  useEffect(() => {
    const fetchDestinations = async () => {
      if (config.analytics?.cdnURL && config.analytics.writeKey) {
        const url = `${config.analytics.cdnURL}/sourceConfig`
        const WRITE_KEY = window.btoa(`${config.analytics.writeKey}:`)
        const response = await fetch(url, {
          headers: {
            Authorization: `Basic ${WRITE_KEY}`,
          },
          method: 'GET',
          // We'd rather have an half consent than no consent at all
          signal: timeout(10).signal,
        })
        if (!response.ok) {
          throw new Error('Failed to fetch integrations from source')
        }

        // TODO: use zod to safe parse and add an error callback in case the schema changed.
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
  }, [setDestinations, config.analytics])

  return {
    destinations,
    isLoaded: destinations !== undefined,
  }
}
