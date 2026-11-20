import type { RudderAnalytics } from '@rudderstack/analytics-js'
// use-analytics/src/__tests__/normalizeIdsMigration.test.ts
import { describe, expect, it, vi } from 'vitest'
import { normalizeIdsMigration } from '../analytics/normalizeIdsMigration'

// Rudder reads these ids from storage; JSON-encoded values are what segment migrations left behind.
const createRudderAnalyticsMock = (ids: { anonymousId?: string; userId?: string; groupId?: string }) => ({
  getAnonymousId: vi.fn<() => string>(() => ids.anonymousId ?? 'anon-id'),
  setAnonymousId: vi.fn<(id: string) => void>(),
  getUserId: vi.fn<() => string | null>(() => ids.userId ?? null),
  identify: vi.fn<(id: string) => void>(),
  getGroupId: vi.fn<() => string | null>(() => ids.groupId ?? null),
  group: vi.fn<(id: string) => void>(),
})

describe(normalizeIdsMigration, () => {
  it('should migrate a JSON-encoded group id', () => {
    const rudder = createRudderAnalyticsMock({
      userId: 'org-42',
      groupId: '"org-42"',
    })

    normalizeIdsMigration(rudder as unknown as RudderAnalytics)

    expect(rudder.group).toHaveBeenCalledExactlyOnceWith('org-42')
  })

  it('should not call group when the group id is already normalized', () => {
    const rudder = createRudderAnalyticsMock({
      userId: 'user-1',
      groupId: 'org-42',
    })

    normalizeIdsMigration(rudder as unknown as RudderAnalytics)

    expect(rudder.group).not.toHaveBeenCalled()
  })

  it('should migrate a JSON-encoded user id', () => {
    const rudder = createRudderAnalyticsMock({
      userId: '"user-7"',
    })

    normalizeIdsMigration(rudder as unknown as RudderAnalytics)

    expect(rudder.identify).toHaveBeenCalledExactlyOnceWith('user-7')
    expect(rudder.group).not.toHaveBeenCalled()
  })
})
