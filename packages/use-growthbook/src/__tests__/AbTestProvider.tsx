// @ts-expect-error TODO: remove once Growthbook is correctly typed and export
import { GrowthBook } from '@growthbook/growthbook-react'
import { render } from '@testing-library/react'
import type { TrackingCallback } from '../AbTestProvider'
import { AbTestProvider } from '../AbTestProvider'
import type { GrowthBookType } from '../types'

jest.mock('@growthbook/growthbook-react')
const mockGrowthBook = GrowthBook as jest.MockedClass<GrowthBookType>

describe('AbTestProvider', () => {
  let trackingCallback: TrackingCallback
  let errorCallback: (error: string) => null

  beforeEach(() => {
    trackingCallback = jest.fn()
    jest.clearAllMocks()
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

    expect(mockGrowthBook).toBeCalled()
    expect(mockGrowthBook.mock.instances[0]?.loadFeatures).toBeCalled()
  })

  it('should not init GrowthBook when client key is not defined', () => {
    render(
      <AbTestProvider
        anonymousId="foo"
        config={{
          apiHost: 'host',
          clientKey: '',
          enableDevMode: true,
        }}
        trackingCallback={trackingCallback}
        errorCallback={errorCallback}
      >
        Foo
      </AbTestProvider>,
    )

    expect(mockGrowthBook).toBeCalled()
    expect(mockGrowthBook.mock.instances[0]?.loadFeatures).not.toBeCalled()
  })
})
