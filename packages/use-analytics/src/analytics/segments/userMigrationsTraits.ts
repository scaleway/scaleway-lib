import type { RudderAnalytics } from '@rudderstack/analytics-js'

const SEGMENT_COOKIES_KEY = {
  ANONYMOUS_ID: 'ajs_anonymous_id',
  USER_ID: 'ajs_user_id',
  GROUP_ID: 'ajs_group_id',
}

export const userMigrationsTraits = (rudderAnalytics: RudderAnalytics) => {
  const segmentAnonymousId = localStorage.getItem(
    SEGMENT_COOKIES_KEY.ANONYMOUS_ID,
  )
  const segmentUserId = localStorage.getItem(SEGMENT_COOKIES_KEY.USER_ID)
  const segmentGroupId = localStorage.getItem(SEGMENT_COOKIES_KEY.GROUP_ID)
  const rudderUserId = rudderAnalytics.getUserId()
  const rudderGroupId = rudderAnalytics.getGroupId()

  if (segmentAnonymousId) {
    rudderAnalytics.setAnonymousId(segmentAnonymousId)
  }

  if (segmentUserId && (!rudderUserId || rudderUserId !== segmentUserId)) {
    rudderAnalytics.identify(segmentUserId)
  }

  if (segmentGroupId && (!rudderGroupId || rudderGroupId !== segmentGroupId)) {
    rudderAnalytics.group(segmentGroupId)
  }
}
