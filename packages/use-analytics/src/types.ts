import { CATEGORIES } from './constants'

export type CategoryKind = (typeof CATEGORIES)[number]

export const isCategoryKind = (key: string): key is CategoryKind =>
  CATEGORIES.includes(key as CategoryKind)

// Uniton type
type Provider = 'custom'
type ResolutionStrategy = 'and' | 'or'

export type Consents = { consent: CategoryKind }[]

type RudderDestination = {
  id: string
  name: string
  enabled: boolean
  config: {
    siteID: string
    blacklistedEvents: string[]
    whitelistedEvents: string[]
    eventFilteringOption: 'blacklistedEvents' | 'whitelistedEvents'
    consentManagement: {
      provider: Provider
      resolutionStrategy: ResolutionStrategy
      consents: Consents
    }[]
  }
  destinationDefinitionId: string
  destinationDefinition: {
    name: string
    displayName: string
  }
  updatedAt?: string
  shouldApplyDeviceModeTransformation: boolean
  propagateEventsUntransformedOnError: boolean
}

export type AnalyticsConfig = {
  source: {
    id: string
    name: string
    writeKey: string
    config: Record<string, unknown>
    enabled: boolean
    workspaceId: string
    destinations: RudderDestination[]
  }
}

export type AnalyticsIntegration = {
  consents: CategoryKind[]
  name: string
  displayName: string
}

export type Consent = { [K in CategoryKind]: boolean }

export type Destination = {
  category: CategoryKind
  name: string
  displayName: string
}

export type Destinations = Destination[]

export type Config = {
  analytics?: {
    writeKey: string
    cdnURL: string
  } | null
}
