// import { AnalyticsBrowser } from '@segment/analytics-next'
// import type { Context } from '@segment/analytics-next'
// import { RudderAnalytics } from '@rudderstack/analytics-js'
// import { render, screen, waitFor } from '@testing-library/react'
// import { describe, expect, it, vi } from 'vitest'
// import {AnalyticsProvider} from './'
// import type { Analytics } from './index'

// const TestChildren = () => <div data-testid="test">children</div>

// const defaultAnalytics = {} as Analytics

// describe('AnalyticsProvider', () => {
//   it('Provider should render children when shouldRenderOnlyWhenReady is false', async () => {
//     const mock = vi
//       .spyOn(RudderAnalytics, 'load')
//       .mockResolvedValue([defaultAnalytics, {} as Context])

//     const settings = { writeKey: 'helloworld', cdnURL: '', timeout: 300 }

//     render(
//       <AnalyticsProvider
//         settings={settings}
//         initOptions={{}}
//         areOptionsLoaded={false}
//         events={{
//           event: () => () => Promise.resolve(),
//         }}
//       >
//         <TestChildren />
//       </AnalyticsProvider>,
//     )

//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(0)
//     })

//     expect(screen.getByTestId('test')).toBeTruthy()
//   })

//   it('Provider should not render children when options are not loaded ', async () => {
//     const mock = vi
//       .spyOn(AnalyticsBrowser, 'load')
//       .mockResolvedValue([{} as Analytics, {} as Context])

//     const settings = { writeKey: 'helloworld' }

//     render(
//       <AnalyticsProvider
//         settings={settings}
//         initOptions={{}}
//         areOptionsLoaded={false}
//         shouldRenderOnlyWhenReady
//         events={{
//           event: () => () => Promise.resolve(),
//         }}
//       >
//         <TestChildren />
//       </AnalyticsProvider>,
//     )

//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(0)
//     })

//     expect(screen.queryByTestId('test')).toBe(null)
//   })

//   it('Provider should not render children when options are not loaded at first render, but load after options changed', async () => {
//     const mock = vi
//       .spyOn(AnalyticsBrowser, 'load')
//       .mockResolvedValue([{} as Analytics, {} as Context])

//     const settings = { writeKey: 'helloworld' }

//     const { rerender } = render(
//       <AnalyticsProvider
//         settings={settings}
//         initOptions={{}}
//         areOptionsLoaded={false}
//         shouldRenderOnlyWhenReady
//         events={{
//           event: () => () => Promise.resolve(),
//         }}
//       >
//         <TestChildren />
//       </AnalyticsProvider>,
//     )

//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(0)
//     })

//     expect(screen.queryByTestId('test')).toBe(null)

//     rerender(
//       <AnalyticsProvider
//         settings={settings}
//         initOptions={{}}
//         areOptionsLoaded
//         shouldRenderOnlyWhenReady
//         events={{
//           event: () => () => Promise.resolve(),
//         }}
//       >
//         <TestChildren />
//       </AnalyticsProvider>,
//     )

//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(1)
//     })

//     expect(screen.queryByTestId('test')).toBeTruthy()
//   })

//   it('Provider should not render children when options are not loaded at first render, but load after options changed even without settings', async () => {
//     const mock = vi
//       .spyOn(AnalyticsBrowser, 'load')
//       .mockResolvedValue([{} as Analytics, {} as Context])

//     const { rerender } = render(
//       <AnalyticsProvider
//         initOptions={{}}
//         areOptionsLoaded={false}
//         shouldRenderOnlyWhenReady
//         events={{
//           event: () => () => Promise.resolve(),
//         }}
//       >
//         <TestChildren />
//       </AnalyticsProvider>,
//     )

//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(0)
//     })

//     expect(screen.queryByTestId('test')).toBe(null)

//     rerender(
//       <AnalyticsProvider
//         initOptions={{}}
//         areOptionsLoaded
//         shouldRenderOnlyWhenReady
//         events={{
//           event: () => () => Promise.resolve(),
//         }}
//       >
//         <TestChildren />
//       </AnalyticsProvider>,
//     )

//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(0)
//     })

//     expect(screen.queryByTestId('test')).toBeTruthy()
//   })
// })
