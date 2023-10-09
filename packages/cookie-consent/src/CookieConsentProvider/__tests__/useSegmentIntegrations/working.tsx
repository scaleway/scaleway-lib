import { describe, expect, it, jest } from '@jest/globals'
import { renderHook, waitFor } from '@testing-library/react'
import { useSegmentIntegrations } from '../..'

globalThis.fetch = jest.fn<any>(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          name: 'Google Universal Analytics',
          creationName: 'Google Analytics',
          description:
            'Google Universal Analytics is the most popular analytics tool for the web. It’s free and provides a wide range of features. It’s especially good at measuring traffic sources and ad campaigns.',
          website: 'http://google.com/analytics',
          category: 'Analytics',
        },
        {
          name: 'Salesforce custom destination (Scaleway)',
          creationName: 'Salesforce custom destination (Scaleway)',
          description:
            'Custom destination to transform from Group call into Track call in order to use custom actions',
          website: 'https://www.segment.com',
          category: 'Other',
        },
        {
          name: 'Salesforce',
          creationName: 'Salesforce',
          description:
            'Salesforce is the most popular CRM on the market. It lets you store your new leads, and manage them throughout your sales pipeline as they turn into paying accounts.',
          website: 'http://salesforce.com',
          category: 'CRM',
        },
        {
          name: 'Scaleway Custom',
          creationName: 'bonjour',
          description: 'hello',
          website: 'http://google-ta.com',
          category: 'Unknown Category',
        },
      ]),
  }),
)

describe('CookieConsent - useSegmentIntegrations', () => {
  it('should call segment and processed results when everything is alright', async () => {
    const { result } = renderHook(() =>
      useSegmentIntegrations({
        segment: { cdnURL: 'https://segment.test', writeKey: 'sampleWriteKey' },
      }),
    )

    await waitFor(() => {
      expect(result.current).toStrictEqual([
        {
          category: 'functional',
          name: 'Segment.io',
        },
        {
          category: 'analytics',
          name: 'Google Universal Analytics',
        },
        {
          category: 'marketing',
          name: 'Salesforce custom destination (Scaleway)',
        },
        {
          category: 'marketing',
          name: 'Salesforce',
        },
        {
          category: 'marketing',
          name: 'Scaleway Custom',
        },
      ])
    })

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled()
    })
  })
})
