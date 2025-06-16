// // import { AnalyticsBrowser } from '@segment/analytics-next'
// // import type { Context } from '@segment/analytics-next'
// import { renderHook, waitFor } from '@testing-library/react'
// import type { ReactNode } from 'react'
// import { beforeEach, describe, expect, it, vi } from 'vitest'
// import waitForExpect from 'wait-for-expect'
// import  { useAnalytics, AnalyticsProvider } from '..'
// import type { Analytics, OnEventError, AnalyticsProviderProps } from '..'

// const eventError = new Error('Error Event')

// const defaultEvents = {
//   errorEvent: (_?: Analytics, onEventError?: OnEventError) => async () => {
//     try {
//       await new Promise((__, reject) => {
//         reject(eventError)
//       })
//     } catch (error) {
//       await onEventError?.(error as Error)
//     }
//   },
//   pageVisited:
//     (analytics?: Analytics) =>
//     async (
//       pageType: 'Docs' | 'Blog' | 'Main',
//       organizationId: string,
//       productCategory?: 'Dedibox' | 'Elements' | 'Datacenter',
//     ): Promise<void> => {
//       analytics?.page(
//         {
//           page_type: pageType,
//           product_category: productCategory,
//         },
//         {
//           context: {
//             groupId: organizationId,
//           },
//         },
//       )
//     },
// }

// type DefaultEvents = typeof defaultEvents

// const wrapper =
//   ({
//     settings,
//     initOptions,
//     areOptionsLoaded,
//     onError,
//     onEventError,
//     events = defaultEvents,
//     shouldRenderOnlyWhenReady,
//   }: Omit<AnalyticsProviderProps<DefaultEvents>, 'children'>) =>
//   ({ children }: { children: ReactNode }) => (
//     <AnalyticsProvider
//       settings={settings}
//       initOptions={initOptions}
//       areOptionsLoaded={areOptionsLoaded}
//       shouldRenderOnlyWhenReady={shouldRenderOnlyWhenReady}
//       onError={onError}
//       onEventError={onEventError}
//       events={events}
//     >
//       {children}
//     </AnalyticsProvider>
//   )

// describe('segment hook', () => {
//   beforeEach(() => {
//     vi.clearAllMocks()
//   })

//   afterAll(() => {
//     vi.restoreAllMocks()
//   })

//   it('useAnalytics should not be defined without AnalyticsProvider', () => {
//     const orignalConsoleError = console.error
//     console.error = vi.fn

//     try {
//       renderHook(() => useAnalytics())
//     } catch (error) {
//       expect((error as Error).message).toBe(
//         'useAnalytics must be used within a AnalyticsProvider',
//       )
//     }

//     console.error = orignalConsoleError
//   })

//   it('useAnalytics should not be ready and not load by default', () => {
//     const mock = vi
//       .spyOn(AnalyticsBrowser, 'load')
//       .mockResolvedValue([{} as Analytics, {} as Context])

//     const { result } = renderHook(() => useAnalytics<DefaultEvents>(), {
//       wrapper: wrapper({
//         events: defaultEvents,
//         settings: undefined,
//       }),
//     })

//     expect(mock).toHaveBeenCalledTimes(0)
//     expect(result.current.analytics).toBe(undefined)
//     expect(result.current.isAnalyticsReady).toBe(false)
//   })

//   it('useAnalytics should not load without settings', () => {
//     const { result } = renderHook(() => useAnalytics<DefaultEvents>(), {
//       wrapper: wrapper({
//         events: defaultEvents,
//         settings: undefined,
//       }),
//     })
//     expect(result.current.analytics).toBe(undefined)
//     expect(result.current.isAnalyticsReady).toBe(false)
//   })

//   it('useAnalytics should not load without initOptions', () => {
//     const { result } = renderHook(() => useAnalytics<DefaultEvents>(), {
//       wrapper: wrapper({
//         events: defaultEvents,
//         settings: { writeKey: 'sample ' },
//         initOptions: undefined,
//       }),
//     })
//     expect(result.current.analytics).toBe(undefined)
//     expect(result.current.isAnalyticsReady).toBe(false)
//   })

//   it('useAnalytics should not load but be ready when All integrations disabled', async () => {
//     const mock = vi
//       .spyOn(AnalyticsBrowser, 'load')
//       .mockResolvedValue([{} as Analytics, {} as Context])

//     const { result } = renderHook(() => useAnalytics<DefaultEvents>(), {
//       wrapper: wrapper({
//         events: defaultEvents,
//         initOptions: { integrations: { All: false } },
//         settings: { writeKey: 'sample ' },
//         areOptionsLoaded: true,
//       }),
//     })
//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(0)
//     })

//     expect(result.current.analytics).toBe(undefined)
//     expect(result.current.isAnalyticsReady).toBe(true)
//   })

//   it('useAnalytics should not load but be ready when all integrations are disabled ', async () => {
//     const mock = vi
//       .spyOn(AnalyticsBrowser, 'load')
//       .mockResolvedValue([{} as Analytics, {} as Context])

//     const { result } = renderHook(() => useAnalytics<DefaultEvents>(), {
//       wrapper: wrapper({
//         events: defaultEvents,
//         initOptions: {
//           integrations: {
//             testInteg: false,
//             testInteg2: false,
//             testInteg3: false,
//           },
//         },
//         settings: { writeKey: 'sample ' },
//         areOptionsLoaded: true,
//       }),
//     })
//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(0)
//     })

//     await waitFor(() => {
//       expect(result.current.analytics).toStrictEqual(undefined)
//     })
//     expect(result.current.isAnalyticsReady).toBe(true)
//   })

//   it('useAnalytics should load when at least one integrations enabled', async () => {
//     const mock = vi
//       .spyOn(AnalyticsBrowser, 'load')
//       .mockResolvedValue([{} as Analytics, {} as Context])

//     const { result } = renderHook(() => useAnalytics<DefaultEvents>(), {
//       wrapper: wrapper({
//         events: defaultEvents,
//         initOptions: {
//           integrations: {
//             testInteg: false,
//             testInteg2: true,
//             testInteg3: false,
//           },
//         },
//         settings: { writeKey: 'sample ' },
//         areOptionsLoaded: true,
//       }),
//     })
//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(1)
//     })

//     await waitFor(() => {
//       expect(result.current.analytics).toStrictEqual({})
//     })
//     expect(result.current.isAnalyticsReady).toBe(true)
//   })

//   it('Provider should not load when options are not loaded', async () => {
//     const mock = vi
//       .spyOn(AnalyticsBrowser, 'load')
//       .mockResolvedValue([{} as Analytics, {} as Context])

//     const settings = { writeKey: 'helloworld' }

//     const { result } = renderHook(() => useAnalytics<DefaultEvents>(), {
//       wrapper: wrapper({
//         events: defaultEvents,
//         settings,
//         initOptions: {},
//         areOptionsLoaded: false,
//       }),
//     })
//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(0)
//     })

//     await waitFor(() => {
//       expect(result.current.analytics).toStrictEqual(undefined)
//     })
//     expect(result.current.isAnalyticsReady).toBe(false)
//   })

//   it('Provider should load with key', async () => {
//     const mock = vi
//       .spyOn(AnalyticsBrowser, 'load')
//       .mockResolvedValue([{} as Analytics, {} as Context])

//     const settings = { writeKey: 'helloworld' }

//     const { result } = renderHook(() => useAnalytics<DefaultEvents>(), {
//       wrapper: wrapper({
//         events: defaultEvents,
//         settings,
//         areOptionsLoaded: true,
//       }),
//     })

//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(1)
//       expect(mock).toHaveBeenCalledWith(settings, undefined)
//     })

//     await waitFor(() => {
//       expect(result.current.analytics).toStrictEqual({})
//     })
//     expect(result.current.isAnalyticsReady).toBe(true)
//   })

//   it('Provider should load with key and cdn', async () => {
//     const mock = vi
//       .spyOn(AnalyticsBrowser, 'load')
//       .mockResolvedValue([{} as Analytics, {} as Context])

//     const settings = { cdn: 'https://cdn.proxy', writeKey: 'helloworld' }

//     const { result } = renderHook(() => useAnalytics<DefaultEvents>(), {
//       wrapper: wrapper({
//         events: defaultEvents,
//         settings,
//         areOptionsLoaded: true,
//       }),
//     })
//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(1)
//       expect(mock).toHaveBeenCalledWith(settings, undefined)
//     })

//     await waitFor(() => {
//       expect(result.current.analytics).toStrictEqual({})
//     })
//     expect(result.current.isAnalyticsReady).toBe(true)
//   })

//   it('Provider should load and call onError on analytics load error', async () => {
//     const error = new Error('not good')
//     const mock = vi.spyOn(AnalyticsBrowser, 'load').mockRejectedValue(error)

//     const onError = vi.fn()
//     const settings = { writeKey: 'pleasethrow' }

//     const { result } = renderHook(() => useAnalytics<DefaultEvents>(), {
//       wrapper: wrapper({
//         events: defaultEvents,
//         onError,
//         settings,
//         areOptionsLoaded: true,
//       }),
//     })
//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(1)
//       expect(mock).toHaveBeenCalledWith(settings, undefined)
//     })

//     await waitForExpect(() => {
//       expect(onError).toHaveBeenCalledTimes(1)
//     })
//     expect(onError).toHaveBeenCalledWith(error)
//     await waitForExpect(() => {
//       expect(result.current.isAnalyticsReady).toBe(true)
//     })
//   })

//   it('Provider call onEventError when an event is trigger with an error', async () => {
//     const mock = vi
//       .spyOn(AnalyticsBrowser, 'load')
//       .mockResolvedValue([{} as Analytics, {} as Context])

//     const onEventError = vi.fn()
//     const onError = vi.fn()

//     const settings = { writeKey: 'pleasethrow' }

//     const { result } = renderHook(() => useAnalytics<DefaultEvents>(), {
//       wrapper: wrapper({
//         events: defaultEvents,
//         onError,
//         onEventError,
//         settings,
//         areOptionsLoaded: true,
//       }),
//     })
//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(1)
//     })

//     await waitFor(async () => {
//       await result.current.events.errorEvent()
//     })

//     await waitForExpect(() => {
//       expect(onEventError).toHaveBeenCalledTimes(1)
//       expect(onEventError).toHaveBeenCalledWith(eventError)
//     })
//     expect(result.current.isAnalyticsReady).toBe(true)
//   })

//   it('Provider should load with settings and initOptions', async () => {
//     const mock = vi
//       .spyOn(AnalyticsBrowser, 'load')
//       .mockResolvedValue([{} as Analytics, {} as Context])

//     const settings = { writeKey: 'helloworld' }
//     const initOptions = {
//       initialPageview: false,
//     }

//     const { result } = renderHook(() => useAnalytics<DefaultEvents>(), {
//       wrapper: wrapper({
//         events: defaultEvents,
//         initOptions,
//         settings,
//         areOptionsLoaded: true,
//       }),
//     })

//     await waitFor(() => {
//       expect(mock).toHaveBeenCalledTimes(1)
//       expect(mock).toHaveBeenCalledWith(settings, initOptions)
//     })

//     await waitFor(() => {
//       expect(result.current.analytics).toStrictEqual({})
//     })
//     expect(result.current.isAnalyticsReady).toBe(true)
//   })

//   it('useAnalytics should correctly infer types', async () => {
//     const { result } = renderHook(() => useAnalytics<DefaultEvents>(), {
//       wrapper: wrapper({
//         events: defaultEvents,
//         settings: undefined,
//       }),
//     })

//     expect(
//       await result.current.events.pageVisited(
//         'Main',
//         'organizationId',
//         'Elements',
//       ),
//     ).toBe(undefined)
//   })
// })
