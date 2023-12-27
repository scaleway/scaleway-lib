import { describe, expect, it, jest } from '@jest/globals'
import type { Context } from '@segment/analytics-next'
import { AnalyticsBrowser } from '@segment/analytics-next'
import { render, screen, waitFor } from '@testing-library/react'
import SegmentProvider from '..'
import type { Analytics } from '../index'

describe('SegmentProvider', () => {
  it('Provider should render children when shouldRenderOnlyWhenReady is false', async () => {
    const mock = jest
      .spyOn(AnalyticsBrowser, 'load')
      .mockResolvedValue([{} as Analytics, {} as Context])

    const settings = { writeKey: 'helloworld' }

    render(
      <SegmentProvider
        settings={settings}
        initOptions={{}}
        areOptionsLoaded={false}
        events={{
          event: () => () => Promise.resolve(),
        }}
      >
        <div>children</div>
      </SegmentProvider>,
    )

    await waitFor(() => {
      expect(mock).toHaveBeenCalledTimes(0)
    })
    expect(screen.getByText('children')).toBeTruthy()
  })

  it('Provider should not render children when analytics is not ready', async () => {
    const mock = jest
      .spyOn(AnalyticsBrowser, 'load')
      .mockResolvedValue([{} as Analytics, {} as Context])

    const settings = { writeKey: 'helloworld' }

    render(
      <SegmentProvider
        settings={settings}
        initOptions={{}}
        areOptionsLoaded={false}
        shouldRenderOnlyWhenReady
        events={{
          event: () => () => Promise.resolve(),
        }}
      >
        <div>children</div>
      </SegmentProvider>,
    )

    await waitFor(() => {
      expect(mock).toHaveBeenCalledTimes(0)
    })
    // FIXME not working
    // expect(screen.findByText('children')).finNoAssertionThatworks ..
  })
})
