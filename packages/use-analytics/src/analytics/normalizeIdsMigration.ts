import type { RudderAnalytics } from '@rudderstack/analytics-js'
import { normalizeId } from './normalizeId'

export const normalizeIdsMigration = (
  rudderAnalytics: RudderAnalytics,
): void => {
  // normalize id issue with segment migration
  const anonymousId = rudderAnalytics.getAnonymousId()
  const normalizeAnonymousId = normalizeId(anonymousId)
  if (normalizeAnonymousId !== anonymousId) {
    rudderAnalytics.setAnonymousId(normalizeAnonymousId)
  }

  const userId = rudderAnalytics.getUserId()
  const normalizeUserId = userId ? normalizeId(userId) : null

  if (userId !== normalizeUserId && normalizeUserId) {
    rudderAnalytics.identify(normalizeUserId)
  }

  const groupId = rudderAnalytics.getGroupId()
  const normalizeGroupId = groupId ? normalizeId(groupId) : null

  if (userId !== normalizeGroupId && normalizeGroupId) {
    rudderAnalytics.group(normalizeGroupId)
  }
}
