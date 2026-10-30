import { AnalyticsContext } from './useAnalytics'

export { AnalyticsProvider } from './AnalyticsProvider'
export { defaultLoadOptions } from './constants'
export { normalizeId } from './normalizeId'
export { normalizeIdsMigration } from './normalizeIdsMigration'
export { userMigrationsTraits } from './segments/userMigrationsTraits'
export type { Analytics, AnalyticsProviderProps, OnEventError } from './useAnalytics'
export { useAnalytics, AnalyticsContext } from './useAnalytics'
export const testUtils: {
  AnalyticsContext: typeof AnalyticsContext
} = {
  AnalyticsContext,
}
export { useDestinations } from './useDestinations'
