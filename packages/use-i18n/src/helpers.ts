import type { SupportedLocalesType } from './types'

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
    const currentLocalFromlocalStorage = globalThis.localStorage.getItem(localeItemStorage)

    if (currentLocalFromlocalStorage !== null && isLocaleSupported(currentLocalFromlocalStorage)) {
      return currentLocalFromlocalStorage
    }
    globalThis.localStorage.removeItem(localeItemStorage)

    const foundBrowserLocale = browserLocales.find(locale => isLocaleSupported(locale))

    if (foundBrowserLocale !== undefined) {
      globalThis.localStorage.setItem(localeItemStorage, foundBrowserLocale)
      setLangAttribute(foundBrowserLocale, rootElement)

      return foundBrowserLocale
    }

    if (defaultLocale && isLocaleSupported(defaultLocale)) {
      globalThis.localStorage.setItem(localeItemStorage, defaultLocale)
      setLangAttribute(defaultLocale, rootElement)

      return defaultLocale
    }
  }

  return defaultLocale
}
