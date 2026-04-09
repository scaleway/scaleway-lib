import { AnalyticsContext } from './useAnalytics'

export { defaultLoadOptions } from './constants'
export { normalizeId } from './normalizeId'
export { normalizeIdsMigration } from './normalizeIdsMigration'
export { userMigrationsTraits } from './segments/userMigrationsTraits'
export type {
  Analytics,
  AnalyticsProviderProps,
  OnEventError,
} from './useAnalytics'
export {
  AnalyticsProvider,
  useAnalytics,
  AnalyticsContext,
} from './useAnalytics'
export const testUtils: {
  AnalyticsContext: typeof AnalyticsContext
} = {
  AnalyticsContext,
}
export { useDestinations } from './useDestinations'
