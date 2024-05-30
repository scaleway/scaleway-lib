// useSegmentIntegrations tests have been splitted in multiple files because of https://github.com/facebook/vi/issues/8987
import SegmentProvider from '@scaleway/use-segment'
import { render } from '@testing-library/react'
import { describe, it } from 'vitest'
import { CookieConsentProvider, SegmentConsentMiddleware } from '..'

const segmentSettings = {
  writeKey: 'writeKey',
  cdnURL: 'cdnURL',
  timeout: 300,
}

describe('CookieConsent - SegmentConsentMiddleware', () => {
  it('should render correctly', () => {
    render(
      <CookieConsentProvider
        isConsentRequired
        essentialIntegrations={['Stripe', 'Sentry']}
        config={{
          segment: segmentSettings,
        }}
      >
        <SegmentProvider settings={segmentSettings} events={{}}>
          <SegmentConsentMiddleware amplitudeIntegrationName="Amplitude (Actions)" />
        </SegmentProvider>
      </CookieConsentProvider>,
    )
  })
})
