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
  if (typeof window !== 'undefined') {
    const { languages: browserLocales } = navigator
    const currentLocalFromlocalStorage = localStorage.getItem(localeItemStorage)

    if (currentLocalFromlocalStorage && isLocaleSupported(currentLocalFromlocalStorage)) {
      return currentLocalFromlocalStorage
    }
    localStorage.removeItem(localeItemStorage)

    const foundBrowserLocale = browserLocales.find(locale => isLocaleSupported(locale))

    if (foundBrowserLocale !== undefined) {
      localStorage.setItem(localeItemStorage, foundBrowserLocale)
      setLangAttribute(foundBrowserLocale, rootElement)

      return foundBrowserLocale
    }

    if (defaultLocale && isLocaleSupported(defaultLocale)) {
      localStorage.setItem(localeItemStorage, defaultLocale)
      setLangAttribute(defaultLocale, rootElement)

      return defaultLocale
    }
  }

  return defaultLocale
}
