import type { SupportedLocalesType } from './types'

// POSIX-style locale identifiers (e.g. `en-US@posix`) are not valid BCP 47 language
// tags and are rejected by `Intl` APIs. Strip the `@modifier` suffix so the locale
// is safe to pass to `Intl.NumberFormat`, `Intl.DateTimeFormat`, etc.
const sanitizeLocale = (locale: string): string => locale.split('@')[0] ?? locale

export const setLangAttribute = (locale: string, rootElement?: Element) => {
  if (rootElement) {
    rootElement.setAttribute('lang', locale)
  } else {
    document.documentElement.lang = locale
  }
}

// Safari private mode throws on setItem: the persisted locale is a best-effort
// cache that must never crash the provider
export const setStoredLocale = (localeItemStorage: string, locale: string): void => {
  try {
    globalThis.localStorage.setItem(localeItemStorage, locale)
  } catch {
    // storage unavailable — detection goes on without the cache
  }
}

export const getCurrentLocale = <LocalSupportedType extends string>({
  defaultLocale,
  isLocaleSupported,
  localeItemStorage,
  rootElement,
}: {
  defaultLocale: LocalSupportedType
  isLocaleSupported: SupportedLocalesType<LocalSupportedType>
  localeItemStorage: string
  rootElement?: Element
}): LocalSupportedType => {
  if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis && 'navigator' in globalThis) {
    const { languages: browserLocales } = globalThis.navigator
    const currentLocalFromLocalStorage = globalThis.localStorage.getItem(localeItemStorage)

    if (typeof currentLocalFromLocalStorage === 'string' && currentLocalFromLocalStorage !== '') {
      const sanitized = sanitizeLocale(currentLocalFromLocalStorage)

      if (isLocaleSupported(sanitized)) {
        // fix corrupted values in localStorage on next load
        if (sanitized !== currentLocalFromLocalStorage) {
          setStoredLocale(localeItemStorage, sanitized)
        }

        return sanitized
      }
    }
    globalThis.localStorage.removeItem(localeItemStorage)

    // a browser locale may carry a region the app does not support (`fr-FR`
    // when only `fr` is): fall back to its language part before giving up on it
    const matchBrowserLocale = (): LocalSupportedType | undefined => {
      for (const browserLocale of browserLocales) {
        const sanitized = sanitizeLocale(browserLocale)

        if (isLocaleSupported(sanitized)) {
          return sanitized
        }

        const [language] = sanitized.split('-')

        if (language !== sanitized && isLocaleSupported(language)) {
          return language
        }
      }

      return undefined
    }

    const foundBrowserLocale = matchBrowserLocale()

    if (foundBrowserLocale !== undefined) {
      setStoredLocale(localeItemStorage, foundBrowserLocale)
      setLangAttribute(foundBrowserLocale, rootElement)

      return foundBrowserLocale
    }

    if (defaultLocale && isLocaleSupported(defaultLocale)) {
      setStoredLocale(localeItemStorage, defaultLocale)
      setLangAttribute(defaultLocale, rootElement)

      return defaultLocale
    }
  }

  return defaultLocale
}
