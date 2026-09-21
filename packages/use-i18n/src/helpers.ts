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

    if (currentLocalFromLocalStorage) {
      const sanitized = sanitizeLocale(currentLocalFromLocalStorage)

      if (isLocaleSupported(sanitized)) {
        // fix corrupted values in localStorage on next load
        if (sanitized !== currentLocalFromLocalStorage) {
          globalThis.localStorage.setItem(localeItemStorage, sanitized)
        }

        return sanitized
      }
    }
    globalThis.localStorage.removeItem(localeItemStorage)

    const foundBrowserLocale = browserLocales.find(locale => isLocaleSupported(sanitizeLocale(locale)))

    if (foundBrowserLocale !== undefined) {
      const sanitized = sanitizeLocale(foundBrowserLocale)

      globalThis.localStorage.setItem(localeItemStorage, sanitized)
      setLangAttribute(sanitized, rootElement)

      if (isLocaleSupported(sanitized)) {
        return sanitized
      }
    }

    if (defaultLocale && isLocaleSupported(defaultLocale)) {
      globalThis.localStorage.setItem(localeItemStorage, defaultLocale)
      setLangAttribute(defaultLocale, rootElement)

      return defaultLocale
    }
  }

  return defaultLocale
}
