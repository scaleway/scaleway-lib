import { parse, serialize } from 'cookie'
import type { SerializeOptions } from 'cookie'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { PropsWithChildren } from 'react'
import { useDestinations } from '../analytics/useDestinations'
import {
  CATEGORIES,
  CONSENT_ADVERTISING_MAX_AGE,
  CONSENT_MAX_AGE,
  COOKIES_OPTIONS,
  COOKIE_PREFIX,
  HASH_COOKIE,
} from '../constants'
import { uniq } from '../helpers/array'
import { IS_CLIENT } from '../helpers/isClient'
import { stringToHash } from '../helpers/misc'
import { isCategoryKind } from '../types'
import type {
  CategoryKind,
  Config,
  Consent,
  Destination,
  Destinations,
} from '../types'

type Context = {
  destinations: Destinations
  needConsent: boolean
  isDestinationsLoaded: boolean
  categories: typeof CATEGORIES
  categoriesConsent: Partial<Consent>
  allowedConsents: (keyof Consent)[]
  deniedConsents: (keyof Consent)[]
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
  manualDestinations,
  config,
  cookiePrefix = COOKIE_PREFIX,
  consentMaxAge = CONSENT_MAX_AGE,
  consentAdvertisingMaxAge = CONSENT_ADVERTISING_MAX_AGE,
  cookiesOptions = COOKIES_OPTIONS,
}: PropsWithChildren<{
  isConsentRequired: boolean
  manualDestinations?: Destinations
  config: Config
  cookiePrefix?: string
  consentMaxAge?: number
  consentAdvertisingMaxAge?: number
  cookiesOptions?: SerializeOptions
}>) => {
  const [needConsent, setNeedsConsent] = useState(false)
  const [cookies, setCookies] = useState<Record<string, string | undefined>>(
    IS_CLIENT ? parse(document.cookie) : {},
  )

  const {
    destinations: analyticsDestinations,
    isLoaded: isDestinationsLoaded,
  } = useDestinations(config)

  const destinations: Destinations = useMemo(
    () =>
      uniq([
        ...(analyticsDestinations ?? []).map(
          dest =>
            ({
              name: dest.name,
              displayName: dest.displayName,
              category: dest.consents[0] ?? 'essential',
            }) satisfies Destination,
        ),
        ...(manualDestinations ?? []),
      ]),
    [analyticsDestinations, manualDestinations],
  )

  // We compute a hash with all the integrations that are enabled
  // This hash will be used to know if we need to ask for consent
  // when a new integration is added
  const destinationsHash = useMemo(
    () =>
      stringToHash(
        uniq(destinations.map(({ name }) => name))
          .sort()
          .join(undefined),
      ),
    [destinations],
  )

  useEffect(() => {
    // We set needConsent at false until we have an answer from the source
    // This is to avoid showing setting needConsent to true only to be set
    // to false after receiving source answer and flicker the UI

    setNeedsConsent(
      isConsentRequired &&
        cookies[HASH_COOKIE] !== destinationsHash.toString() &&
        analyticsDestinations !== undefined,
    )
  }, [isConsentRequired, destinationsHash, analyticsDestinations, cookies])

  // From the unique categories names we can now build our consent object
  // and check if there is already a consent in a cookie
  // Default consent if none is found is false
  const cookieConsent = useMemo(
    () =>
      CATEGORIES.reduce<Partial<Consent>>(
        (acc, category) => ({
          ...acc,
          [category]:
            isConsentRequired || needConsent
              ? cookies[`${cookiePrefix}_${category}`] === 'true'
              : true,
        }),
        {},
      ),
    [isConsentRequired, cookiePrefix, needConsent, cookies],
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
          document.cookie = serialize(cookieName, '', {
            ...cookiesOptions,
            expires: new Date(0),
          })
        } else {
          document.cookie = serialize(cookieName, consentValue.toString(), {
            ...cookiesOptions,
            maxAge:
              consentCategoryName === 'advertising'
                ? consentAdvertisingMaxAge
                : consentMaxAge,
          })
        }
        setCookies(prevCookies => ({
          ...prevCookies,
          [cookieName]: consentValue ? 'true' : 'false',
        }))
      }
      // We set the hash cookie to the current consented integrations
      document.cookie = serialize(HASH_COOKIE, destinationsHash.toString(), {
        ...cookiesOptions,
        // Here we use the shortest max age to force to ask again for expired consent
        maxAge: consentAdvertisingMaxAge,
      })
      setCookies(prevCookies => ({
        ...prevCookies,
        [HASH_COOKIE]: destinationsHash.toString(),
      }))
      setNeedsConsent(false)
    },
    [
      destinationsHash,
      consentAdvertisingMaxAge,
      consentMaxAge,
      cookiePrefix,
      cookiesOptions,
    ],
  )

  const allowedConsents = useMemo(
    () =>
      Object.keys(cookieConsent).filter(
        key => cookieConsent[key as CategoryKind],
      ) as CategoryKind[],
    [cookieConsent],
  )

  const deniedConsents = useMemo(
    () =>
      Object.keys(cookieConsent).filter(
        key => !allowedConsents.includes(key as CategoryKind),
      ) as CategoryKind[],
    [cookieConsent, allowedConsents],
  )

  const value = useMemo(
    () => ({
      destinations,
      needConsent,
      isDestinationsLoaded,
      categoriesConsent: cookieConsent,
      allowedConsents,
      deniedConsents,
      saveConsent,
      categories: CATEGORIES,
      cookies,
    }),
    [
      destinations,
      isDestinationsLoaded,
      needConsent,
      allowedConsents,
      deniedConsents,
      cookieConsent,
      saveConsent,
      cookies,
    ],
  )

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  )
}
