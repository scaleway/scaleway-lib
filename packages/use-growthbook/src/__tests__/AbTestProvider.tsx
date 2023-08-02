// @ts-expect-error TODO: remove once Growthbook is correctly typed and export
import { GrowthBook } from '@growthbook/growthbook-react'
import { render } from '@testing-library/react'
import type { TrackingCallback } from '../AbTestProvider'
import { AbTestProvider } from '../AbTestProvider'

jest.mock('@growthbook/growthbook-react')

describe('AbTestProvider', () => {
  let trackingCallback: TrackingCallback
  let errorCallback: (error: string) => null

  beforeEach(() => {
    trackingCallback = jest.fn()
  })
  it('should init GrowthBook once', () => {
    render(
      <AbTestProvider
        anonymousId="foo"
        config={{
          apiHost: 'host',
          clientKey: 'clientKey',
          enableDevMode: true,
        }}
        trackingCallback={trackingCallback}
        errorCallback={errorCallback}
      >
        Foo
      </AbTestProvider>,
    )

    expect(GrowthBook).toBeCalledTimes(1)
  })
})
