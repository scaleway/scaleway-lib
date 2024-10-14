import type { SerializeOptions } from 'cookie'
import cookie from 'cookie'
import type { PropsWithChildren } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { uniq } from '../helpers/array'
import { stringToHash } from '../helpers/misc'
import { isCategoryKind } from './helpers'
import type { Config, Consent, Integrations } from './types'
import { useSegmentIntegrations } from './useSegmentIntegrations'

const COOKIE_PREFIX = '_scw_rgpd'
const HASH_COOKIE = `${COOKIE_PREFIX}_hash`
const IS_CLIENT = typeof document !== 'undefined'

// Appx 13 Months
const CONSENT_MAX_AGE = 13 * 30 * 24 * 60 * 60
// Appx 6 Months
const CONSENT_ADVERTISING_MAX_AGE = 6 * 30 * 24 * 60 * 60

const COOKIES_OPTIONS: SerializeOptions = {
  sameSite: 'strict',
  secure: true,
  path: '/',
} as const

type Context = {
  integrations: Integrations
  needConsent: boolean
  isSegmentAllowed: boolean
  isSegmentIntegrationsLoaded: boolean
  segmentIntegrations: Record<string, boolean>
  categoriesConsent: Partial<Consent>
  saveConsent: (categoriesConsent: Partial<Consent>) => void
}

const CookieConsentContext = createContext<Context | undefined>(undefined)

export const useCookieConsent = (): Context => {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error(
      'useCookieConsent must be used within a CookieConsentProvider',
    )
  }

  return context
}

export const CookieConsentProvider = ({
  children,
  isConsentRequired,
  essentialIntegrations,
  config,
  cookiePrefix = COOKIE_PREFIX,
  consentMaxAge = CONSENT_MAX_AGE,
  consentAdvertisingMaxAge = CONSENT_ADVERTISING_MAX_AGE,
  cookiesOptions = COOKIES_OPTIONS,
}: PropsWithChildren<{
  isConsentRequired: boolean
  essentialIntegrations: string[]
  config: Config
  cookiePrefix?: string
  consentMaxAge?: number
  consentAdvertisingMaxAge?: number
  cookiesOptions?: SerializeOptions
}>) => {
  const [needConsent, setNeedsConsent] = useState(false)
  const [cookies, setCookies] = useState<Record<string, string | undefined>>(
    IS_CLIENT ? cookie.parse(document.cookie) : {},
  )

  const {
    integrations: segmentIntegrations,
    isLoaded: isSegmentIntegrationsLoaded,
  } = useSegmentIntegrations(config)

  const integrations: Integrations = useMemo(
    () =>
      uniq([
        ...(segmentIntegrations ?? []),
        ...(essentialIntegrations.map(integration => ({
          name: integration,
          category: 'essential',
        })) as Integrations),
      ]),
    [segmentIntegrations, essentialIntegrations],
  )

  // We compute a hash with all the integrations that are enabled
  // This hash will be used to know if we need to ask for consent
  // when a new integration is added
  const integrationsHash = useMemo(
    () =>
      stringToHash(
        uniq([
          ...(segmentIntegrations ?? []).map(({ name }) => name),
          ...essentialIntegrations,
        ])
          .sort()
          .join(undefined),
      ),
    [segmentIntegrations, essentialIntegrations],
  )

  useEffect(() => {
    // We set needConsent at false until we have an answer from segment
    // This is to avoid showing setting needConsent to true only to be set
    // to false after receiving segment answer and flicker the UI
    setNeedsConsent(
      isConsentRequired &&
        cookies[HASH_COOKIE] !== integrationsHash.toString() &&
        segmentIntegrations !== undefined,
    )
  }, [isConsentRequired, integrationsHash, segmentIntegrations, cookies])

  // We store unique categories names in an array
  const categories = useMemo(
    () =>
      uniq((segmentIntegrations ?? []).map(({ category }) => category)).sort(
        undefined,
      ),
    [segmentIntegrations],
  )

  // From the unique categories names we can now build our consent object
  // and check if there is already a consent in a cookie
  // Default consent if none is found is false
  const cookieConsent = useMemo(
    () =>
      categories.reduce<Partial<Consent>>(
        (acc, category) => ({
          ...acc,
          [category]:
            isConsentRequired || needConsent
              ? cookies[`${cookiePrefix}_${category}`] === 'true'
              : true,
        }),
        {},
      ),
    [isConsentRequired, categories, cookiePrefix, needConsent, cookies],
  )

  const saveConsent = useCallback(
    (categoriesConsent: Partial<Consent>) => {
      for (const [consentName, consentValue] of Object.entries(
        categoriesConsent,
      )) {
        const consentCategoryName = isCategoryKind(consentName)
          ? consentName
          : 'unknown'

        const cookieName = `${cookiePrefix}_${consentCategoryName}`

        if (!consentValue) {
          // If consent is set to false we have to delete the cookie
          document.cookie = cookie.serialize(cookieName, '', {
            ...cookiesOptions,
            expires: new Date(0),
          })
        } else {
          document.cookie = cookie.serialize(
            cookieName,
            consentValue.toString(),
            {
              ...cookiesOptions,
              maxAge:
                consentCategoryName === 'advertising'
                  ? consentAdvertisingMaxAge
                  : consentMaxAge,
            },
          )
        }
        setCookies(prevCookies => ({
          ...prevCookies,
          [cookieName]: consentValue ? 'true' : 'false',
        }))
      }
      // We set the hash cookie to the current consented integrations
      document.cookie = cookie.serialize(
        HASH_COOKIE,
        integrationsHash.toString(),
        {
          ...cookiesOptions,
          // Here we use the shortest max age to force to ask again for expired consent
          maxAge: consentAdvertisingMaxAge,
        },
      )
      setCookies(prevCookies => ({
        ...prevCookies,
        [HASH_COOKIE]: integrationsHash.toString(),
      }))
      setNeedsConsent(false)
    },
    [
      integrationsHash,
      consentAdvertisingMaxAge,
      consentMaxAge,
      cookiePrefix,
      cookiesOptions,
    ],
  )

  const isSegmentAllowed = useMemo(
    () =>
      isConsentRequired
        ? !needConsent &&
          !!segmentIntegrations?.some(
            integration => cookieConsent[integration.category],
          )
        : true,
    [isConsentRequired, segmentIntegrations, cookieConsent, needConsent],
  )
  // 'All': false tells Segment not to send data to any Destinations by default, unless they’re explicitly listed as true in the next lines.
  // In this case we should not have any integration, so we protect the user. Maybe unecessary as we always set true of false for an integration.
  const segmentEnabledIntegrations = useMemo(
    () =>
      segmentIntegrations?.length === 0
        ? { All: !isConsentRequired }
        : (segmentIntegrations ?? []).reduce<Record<string, boolean>>(
            (acc, integration) => ({
              ...acc,
              [integration.name]: cookieConsent[integration.category] ?? false,
            }),
            {},
          ),
    [cookieConsent, isConsentRequired, segmentIntegrations],
  )

  const value = useMemo(
    () => ({
      integrations,
      needConsent,
      isSegmentAllowed,
      isSegmentIntegrationsLoaded,
      segmentIntegrations: segmentEnabledIntegrations,
      categoriesConsent: cookieConsent,
      saveConsent,
    }),
    [
      integrations,
      needConsent,
      isSegmentAllowed,
      isSegmentIntegrationsLoaded,
      segmentEnabledIntegrations,
      cookieConsent,
      saveConsent,
    ],
  )

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  )
}
