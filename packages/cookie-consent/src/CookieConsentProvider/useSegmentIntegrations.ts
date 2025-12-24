import { useEffect, useState } from 'react'
import type { CategoryKind, Config, Integrations } from './types'

type SegmentIntegration = {
  category: string
  creationName: string
  description: string
  name: string
  website: string
}

const defaultSegmentIoIntegration: SegmentIntegration = {
  category: 'Functional',
  creationName: 'Segment.io',
  description: '',
  name: 'Segment.io',
  website: 'https://segment.io',
}

const timeout = (time: number) => {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), time * 1000)

  return controller
}

type SegmentIntegrations = SegmentIntegration[]

const CATEGORY_MATCH: Record<string, CategoryKind> = {
  Analytics: 'analytics',
  CRM: 'marketing',
  Functional: 'functional',
  Other: 'marketing',
}

const transformSegmentIntegrationsToIntegrations = (
  segmentIntegrations: SegmentIntegrations,
): Integrations =>
  [defaultSegmentIoIntegration, ...segmentIntegrations].map(
    ({ category, creationName, name }) => ({
      category: CATEGORY_MATCH[category] ?? 'marketing',
      // Segment requires the `creationName` for this destination.
      name: name === 'Google Ads (Gtag)' ? creationName : name,
    }),
  )

type SegmentIntegrationsHook = (config: Config) => {
  integrations: Integrations | undefined
  isLoaded: boolean
}
// Will return undefined if loading, empty array if no response or error, response else
export const useSegmentIntegrations: SegmentIntegrationsHook = (
  config: Config,
) => {
  const [integrations, setIntegrations] = useState<Integrations | undefined>(
    undefined,
  )

  useEffect(() => {
    const fetchIntegrations = async () => {
      if (config.segment?.cdnURL && config.segment.writeKey) {
        const response = await fetch(
          `${config.segment.cdnURL}/v1/projects/${config.segment.writeKey}/integrations`,
          {
            // We'd rather have an half consent than no consent at all
            signal: timeout(10).signal,
          },
        )
        if (!response.ok) {
          throw new Error('Failed to fetch segment integrations')
        }
        const json = (await response.json()) as SegmentIntegrations

        return transformSegmentIntegrationsToIntegrations(json)
      }

      return []
    }

    fetchIntegrations()
      .then(response => {
        setIntegrations(response)
      })
      .catch(() => {
        setIntegrations([])
      })
  }, [setIntegrations, config.segment])

  return {
    integrations,
    isLoaded: integrations !== undefined,
  }
}
