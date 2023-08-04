// @ts-expect-error TODO: remove once Growthbook is correctly typed and export
import type { GrowthBook } from '@growthbook/growthbook-react'
import { render } from '@testing-library/react'
import type { TrackingCallback } from '../AbTestProvider'
import { AbTestProvider } from '../AbTestProvider'
import type { GrowthBookType } from '../types'

jest.mock('@growthbook/growthbook-react')
let mockedGrowthBook: jest.MockedClass<typeof GrowthBook>

describe('AbTestProvider', () => {
  let trackingCallback: TrackingCallback
  let errorCallback: (error: string) => null

  beforeEach(() => {
    trackingCallback = jest.fn()
    ;(mockedGrowthBook as jest.Mock).mockClear()
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
    const growthBookInstance = (mockedGrowthBook as jest.Mock).mock
      .instances[0] as GrowthBookType

    expect(mockedGrowthBook).toBeCalledTimes(1)
    expect(growthBookInstance.loadFeatures).toBeCalled()
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
    const growthBookInstance = (mockedGrowthBook as jest.Mock).mock
      .instances[0] as GrowthBookType

    expect(mockedGrowthBook).toBeCalledTimes(1)
    expect(growthBookInstance.loadFeatures).not.toBeCalled()
  })
})
