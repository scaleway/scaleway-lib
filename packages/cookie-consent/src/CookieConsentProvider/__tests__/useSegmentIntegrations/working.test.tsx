import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useSegmentIntegrations } from '../../useSegmentIntegrations'

globalThis.fetch = vi.fn(async () =>
  Promise.resolve({
    json: async () =>
      Promise.resolve([
        {
          category: 'Analytics',
          creationName: 'Google Analytics',
          description:
            'Google Universal Analytics is the most popular analytics tool for the web. It’s free and provides a wide range of features. It’s especially good at measuring traffic sources and ad campaigns.',
          name: 'Google Universal Analytics',
          website: 'http://google.com/analytics',
        },
        {
          category: 'Other',
          creationName: 'Salesforce custom destination (Scaleway)',
          description:
            'Custom destination to transform from Group call into Track call in order to use custom actions',
          name: 'Salesforce custom destination (Scaleway)',
          website: 'https://www.segment.com',
        },
        {
          category: 'CRM',
          creationName: 'Salesforce',
          description:
            'Salesforce is the most popular CRM on the market. It lets you store your new leads, and manage them throughout your sales pipeline as they turn into paying accounts.',
          name: 'Salesforce',
          website: 'http://salesforce.com',
        },
        {
          category: 'Unknown Category',
          creationName: 'bonjour',
          description: 'hello',
          name: 'Scaleway Custom',
          website: 'http://google-ta.com',
        },
        {
          category: 'Advertising',
          creationName: 'Google AdWords New',
          description: `Advertise on Google and put your message in front of potential customers right when they're searching for what you have to offer.`,
          name: 'Google Ads (Gtag)',
          website: 'https://adwords.google.com',
        },
        {
          category: 'Analytics',
          creationName: 'Actions Amplitude',
          description:
            'Amplitude is an event tracking and segmentation platform for your web and mobile apps. By analyzing the actions your users perform, you can gain a better understanding to drive retention, engagement, and conversion.',
          name: 'Amplitude (Actions)',
          website: 'https://amplitude.com',
        },
      ]),
    ok: true,
  } as unknown as Response),
)

describe('cookieConsent - useSegmentIntegrations', () => {
  it('should call segment and processed results when everything is alright', async () => {
    const { result } = renderHook(() =>
      useSegmentIntegrations({
        segment: { cdnURL: 'https://segment.test', writeKey: 'sampleWriteKey' },
      }),
    )

    expect(result.current.isLoaded).toBeFalsy()

    await waitFor(() => {
      expect(result.current.integrations).toStrictEqual([
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
        {
          category: 'marketing',
          name: 'Google AdWords New',
        },
        {
          category: 'analytics',
          name: 'Amplitude (Actions)',
        },
      ])
    })

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled()
    })
    expect(result.current.isLoaded).toBeTruthy()
  })
})
