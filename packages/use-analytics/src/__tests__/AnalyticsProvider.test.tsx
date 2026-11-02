import { act, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AnalyticsProvider } from '../analytics/AnalyticsProvider'
import type { Analytics } from '../analytics/useAnalytics'
import { useAnalytics } from '../analytics/useAnalytics'
import type { CategoryKind } from '../types'

const rudder = vi.hoisted(() => {
  const readyCallbacks: (() => void)[] = []
  const load = vi.fn<(...args: unknown[]) => void>()
  const consent = vi.fn<(...args: unknown[]) => void>()

  class MockRudderAnalytics {
    public load = load
    public consent = consent
    public identify = vi.fn<(...args: unknown[]) => void>()
    public setAnonymousId = vi.fn<(...args: unknown[]) => void>()
    public readyCallbacks = readyCallbacks
    public anonymousId = ''
    public getAnonymousId = (): string => this.anonymousId
    public getUserId = (): string => this.anonymousId
    public getGroupId = (): string => this.anonymousId
    public ready = (fireReady: () => void): void => {
      this.readyCallbacks.push(fireReady)
    }
  }

  return { readyCallbacks, load, consent, MockRudderAnalytics }
})

// Keep the string form: the real `RudderAnalytics` class carries static members we don't need to mock.
// oxlint-disable-next-line vitest/prefer-import-in-mock
vi.mock('@rudderstack/analytics-js', () => ({
  RudderAnalytics: rudder.MockRudderAnalytics,
}))

const onLoaded = vi.fn<(analytics: Analytics) => void>()

const ReadyState = () => {
  const { isAnalyticsReady } = useAnalytics()
  return <div data-testid="ready">{isAnalyticsReady ? 'ready' : 'loading'}</div>
}

type Overrides = {
  settings?: { writeKey: string; cdnURL: string }
  needConsent?: boolean
  shouldRenderOnlyWhenReady?: boolean
  timeout?: number
  onError?: (error: Error) => void
}

const renderProvider = (overrides: Overrides = {}) =>
  render(
    <AnalyticsProvider
      allowedConsents={[] as CategoryKind[]}
      deniedConsents={[] as CategoryKind[]}
      events={{}}
      onLoaded={onLoaded}
      {...overrides}
    >
      <ReadyState />
    </AnalyticsProvider>,
  )

const readyText = () => screen.getByTestId('ready').textContent

describe('AnalyticsProvider readiness', () => {
  beforeEach(() => {
    rudder.readyCallbacks.length = 0
  })

  it('resolves isAnalyticsReady immediately when settings has no writeKey (analytics disabled)', async () => {
    renderProvider({ settings: { writeKey: '', cdnURL: '' }, needConsent: false, timeout: 2000 })

    // No timers advanced: nothing was ever loaded, so it must be ready at once.
    await waitFor(() => {
      expect(readyText()).toBe('ready')
    })
    expect(rudder.load).not.toHaveBeenCalled()
    expect(rudder.readyCallbacks).toHaveLength(0)
  })

  it('does not report a timeout error when analytics is disabled', async () => {
    const onError = vi.fn<(error: Error) => void>()
    renderProvider({ settings: { writeKey: '', cdnURL: '' }, needConsent: false, timeout: 2000, onError })

    await waitFor(() => {
      expect(readyText()).toBe('ready')
    })
    expect(onError).not.toHaveBeenCalled()
  })

  it('still waits for analytics.ready() when a writeKey is configured', () => {
    const onError = vi.fn<(error: Error) => void>()
    renderProvider({
      settings: { writeKey: 'write-key', cdnURL: 'https://cdn.example.com' },
      needConsent: false,
      timeout: 2000,
      onError,
    })

    expect(readyText()).toBe('loading')
    expect(rudder.load).toHaveBeenCalledTimes(1)
    expect(onError).not.toHaveBeenCalled()

    act(() => {
      for (const fireReady of rudder.readyCallbacks) {
        fireReady()
      }
    })

    expect(readyText()).toBe('ready')
  })

  it('renders children when disabled even if consent is required and shouldRenderOnlyWhenReady', async () => {
    renderProvider({
      settings: { writeKey: '', cdnURL: '' },
      needConsent: true,
      shouldRenderOnlyWhenReady: true,
    })

    await waitFor(() => {
      expect(readyText()).toBe('ready')
    })
  })

  it('hides children when a writeKey is configured, consent is required and shouldRenderOnlyWhenReady', () => {
    renderProvider({
      settings: { writeKey: 'write-key', cdnURL: 'https://cdn.example.com' },
      needConsent: true,
      shouldRenderOnlyWhenReady: true,
      timeout: 2000,
    })

    expect(screen.queryByTestId('ready')).toBeNull()
  })
})
