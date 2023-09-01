import cookie from 'cookie'
import type { ReactNode } from 'react'
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
import type { CategoryKind, Config, Consent, Integrations } from './types'
import { useSegmentIntegrations } from './useSegmentIntegrations'

const COOKIE_PREFIX = '_scw_rgpd'
const HASH_COOKIE = `${COOKIE_PREFIX}_hash`

// Appx 13 Months
const CONSENT_MAX_AGE = 13 * 30 * 24 * 60 * 60
// Appx 6 Months
const CONSENT_ADVERTISING_MAX_AGE = 6 * 30 * 24 * 60 * 60

const COOKIES_OPTIONS = {
  sameSite: 'strict',
  secure: true,
  path: '/',
} as const

type Context = {
  integrations: Integrations
  needConsent: boolean
  isSegmentAllowed: boolean
  segmentIntegrations: { All: boolean } & Record<string, boolean>
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
}: {
  children: ReactNode
  isConsentRequired: boolean
  essentialIntegrations: string[]
  config: Config
}) => {
  const [needConsent, setNeedsConsent] = useState(false)

  const [cookies, setCookies] = useState<Record<string, string>>()
  const segmentIntegrations = useSegmentIntegrations(config)

  useEffect(() => {
    setCookies(cookie.parse(document.cookie))
  }, [needConsent])

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
          .join(),
      ),
    [segmentIntegrations, essentialIntegrations],
  )

  useEffect(() => {
    // We set needConsent at false until we have an answer from segment
    // This is to avoid showing setting needConsent to true only to be set
    // to false after receiving segment answer and flciker the UI
    setNeedsConsent(
      isConsentRequired &&
        cookies?.[HASH_COOKIE] !== integrationsHash.toString() &&
        segmentIntegrations !== undefined,
    )
  }, [isConsentRequired, cookies, integrationsHash, segmentIntegrations])

  // We store unique categories names in an array
  const categories = useMemo(
    () =>
      uniq([
        ...(segmentIntegrations ?? []).map(({ category }) => category),
      ]).sort(),
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
          [category]: isConsentRequired
            ? cookies?.[`${COOKIE_PREFIX}_${category}`] === 'true'
            : true,
        }),
        {},
      ),
    [isConsentRequired, categories, cookies],
  )

  const saveConsent = useCallback(
    (categoriesConsent: Partial<Consent>) => {
      for (const [consentName, consentValue] of Object.entries(
        categoriesConsent,
      ) as [CategoryKind, boolean][]) {
        const cookieName = `${COOKIE_PREFIX}_${consentName}`

        if (!consentValue) {
          // If consent is set to false we have to delete the cookie
          document.cookie = cookie.serialize(cookieName, '', {
            expires: new Date(0),
          })
        } else {
          document.cookie = cookie.serialize(
            `${COOKIE_PREFIX}_${consentName}`,
            consentValue.toString(),
            {
              ...COOKIES_OPTIONS,
              maxAge:
                consentName === 'advertising'
                  ? CONSENT_ADVERTISING_MAX_AGE
                  : CONSENT_MAX_AGE,
            },
          )
        }
      }
      // We set the hash cookie to the current consented integrations
      document.cookie = cookie.serialize(
        HASH_COOKIE,
        integrationsHash.toString(),
        {
          ...COOKIES_OPTIONS,
          // Here we use the shortest max age to force to ask again for expired consent
          maxAge: CONSENT_ADVERTISING_MAX_AGE,
        },
      )
      setNeedsConsent(false)
    },
    [integrationsHash],
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

  const segmentEnabledIntegrations = useMemo(
    () => ({
      All: false,
      ...segmentIntegrations?.reduce(
        (acc, integration) => ({
          ...acc,
          [integration.name]: cookieConsent[integration.category],
        }),
        {},
      ),
    }),
    [cookieConsent, segmentIntegrations],
  )

  const value = useMemo(
    () => ({
      integrations,
      needConsent,
      isSegmentAllowed,
      segmentIntegrations: segmentEnabledIntegrations,
      categoriesConsent: cookieConsent,
      saveConsent,
    }),
    [
      integrations,
      cookieConsent,
      saveConsent,
      needConsent,
      isSegmentAllowed,
      segmentEnabledIntegrations,
    ],
  )

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  )
}
