import type { RudderAnalytics } from '@rudderstack/analytics-js'
import { normalizeId } from '../normalizeId'

const SEGMENT_COOKIES_KEY = {
  ANONYMOUS_ID: 'ajs_anonymous_id',
  GROUP_ID: 'ajs_group_id',
  USER_ID: 'ajs_user_id',
}

export const userMigrationsTraits = (
  rudderAnalytics: RudderAnalytics,
): void => {
  const segmentAnonymousId = localStorage.getItem(
    SEGMENT_COOKIES_KEY.ANONYMOUS_ID,
  )
  const segmentUserId = localStorage.getItem(SEGMENT_COOKIES_KEY.USER_ID)
  const segmentGroupId = localStorage.getItem(SEGMENT_COOKIES_KEY.GROUP_ID)
  const rudderUserId = rudderAnalytics.getUserId()
  const rudderGroupId = rudderAnalytics.getGroupId()

  if (segmentAnonymousId) {
    rudderAnalytics.setAnonymousId(normalizeId(segmentAnonymousId))
  }

  if (segmentUserId && (!rudderUserId || rudderUserId !== segmentUserId)) {
    const normalizedUserId = normalizeId(segmentUserId)
    if (normalizedUserId) {
      rudderAnalytics.identify(normalizedUserId)
    }
  }

  if (segmentGroupId && (!rudderGroupId || rudderGroupId !== segmentGroupId)) {
    const normalizedGroupId = normalizeId(segmentGroupId)
    if (normalizedGroupId) {
      rudderAnalytics.group(normalizedGroupId)
    }
  }
}
