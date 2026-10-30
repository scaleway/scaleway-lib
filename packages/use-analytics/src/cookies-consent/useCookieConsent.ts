import { createContext, useContext } from 'react'
import type { CATEGORIES } from '../constants'
import type { Consent, Destinations } from '../types'

type Context = {
  destinations: Destinations
  needConsent: boolean
  isDestinationsLoaded: boolean
  categories: typeof CATEGORIES
  categoriesConsent: Partial<Consent>
  saveConsent: (categoriesConsent: Partial<Consent>) => void
}

export const CookieConsentContext = createContext<Context | undefined>(undefined)

export const useCookieConsent = (): Context => {
  const context = useContext(CookieConsentContext)
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider')
  }

  return context
}
