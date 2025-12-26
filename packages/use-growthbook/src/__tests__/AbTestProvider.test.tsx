import { GrowthBook } from '@growthbook/growthbook-react'
import { render } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AbTestProvider } from '../AbTestProvider'

type TrackingCallback = ComponentProps<
  typeof AbTestProvider
>['trackingCallback']

type ErrorCallback = ComponentProps<typeof AbTestProvider>['errorCallback']

const errorCallback: ErrorCallback = () => null

describe('abTestProvider', () => {
  const trackingCallback = vi.fn<TrackingCallback>()

  it('should init GrowthBook once', () => {
    render(
      <AbTestProvider
        config={{
          apiHost: 'host',
          clientKey: 'clientKey',
          enableDevMode: true,
        }}
        attributes={{
          anonymousId: 'foo',
        }}
        trackingCallback={trackingCallback}
        errorCallback={errorCallback}
      >
        Children
      </AbTestProvider>,
    )

    expect(GrowthBook).toBeCalled()
  })

  it('should not init GrowthBook when client key is not defined', () => {
    render(
      <AbTestProvider
        config={{
          apiHost: 'host',
          clientKey: '',
          enableDevMode: true,
        }}
        attributes={{
          anonymousId: 'foo',
        }}
        trackingCallback={trackingCallback}
        errorCallback={errorCallback}
      >
        Children
      </AbTestProvider>,
    )

    expect(GrowthBook).toBeCalled()
  })
})
