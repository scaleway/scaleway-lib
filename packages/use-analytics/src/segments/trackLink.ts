import type { RudderAnalytics } from '@rudderstack/analytics-js'
import type {
  EventProperties,
  Analytics as SegmentAnalytics,
} from '@segment/analytics-next'

export type TrackLink = SegmentAnalytics['trackLink']

/**
 * @deprecated
 * this function is a wrapper of a Track to facilitate the migration from segment to rudderstack
 */
export const trackLink =
  (analytics: RudderAnalytics) =>
  (...args: Parameters<SegmentAnalytics['trackLink']>) => {
    const [, event, properties] = args

    return analytics.track(event as string, properties as EventProperties)
  }
