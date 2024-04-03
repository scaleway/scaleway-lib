import { useSegment } from '@scaleway/use-segment'
import cookie from 'cookie'
import type { PropsWithChildren } from 'react'
import { useCookieConsent } from './CookieConsentProvider'
import { type CategoryKind, isCategoryKind } from './helpers'

export const AMPLITUDE_INTEGRATION_NAME = 'Amplitude (Actions)'
const COOKIE_SESSION_ID_NAME = 'analytics_session_id'

export const getSessionId = () => {
  const sessionId = cookie.parse(document.cookie)[COOKIE_SESSION_ID_NAME]
  if (sessionId) {
    return Number.parseInt(sessionId, 10)
  }

  return Date.now()
}

/**
 * inspiration
 * https://github.com/segmentio/consent-manager/blob/f9d5166679b3c928b394b8ad50d517fdf43654b1/src/consent-manager-builder/analytics.ts#L20
 */
export const SegmentConsentMiddleware = ({
  children,
  amplitudeIntegrationName = AMPLITUDE_INTEGRATION_NAME,
}: PropsWithChildren<{
  amplitudeIntegrationName?: string
}>) => {
  const { analytics } = useSegment()
  const { categoriesConsent } = useCookieConsent()

  const categoriesPreferencesAccepted: CategoryKind[] = []

  for (const [key, value] of Object.entries(categoriesConsent)) {
    if (value && isCategoryKind(key)) {
      categoriesPreferencesAccepted.push(key)
    }
  }

  analytics
    ?.addSourceMiddleware(({ payload, next }) => {
      if (payload.obj.context) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-param-reassign
        payload.obj.context['consent'] = {
          ...payload.obj.context['consent'],
          defaultDestinationBehavior: null,
          // Need to be handle if we let the user choose per destination and not per categories.
          destinationPreferences: null,
          categoryPreferences: categoriesPreferencesAccepted,
        }
      }

      // actually there is a bug on the default script.
      if (payload.integrations()[amplitudeIntegrationName]) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-param-reassign
        payload.obj.integrations = {
          ...payload.obj.integrations,
          [amplitudeIntegrationName]: {
            session_id: getSessionId(),
          },
        }
      }

      return next(payload)
    })
    .catch(() => null)

  return children
}
