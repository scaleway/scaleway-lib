import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns'
import memoizeIntlConstructor from 'intl-format-cache'
import IntlTranslationFormat from 'intl-messageformat'
import PropTypes from 'prop-types'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import 'intl-pluralrules'

const LOCALE_ITEM_STORAGE = 'locale'

const prefixKeys = prefix => obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[prefix + key] = obj[key]

    return acc
  }, {})

const I18nContext = createContext()

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within a I18nProvider')
  }

  return context
}

export const useTranslation = (namespaces = [], load) => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a I18nProvider')
  }
  const { loadTranslations } = context

  const key = namespaces.join(',')
  useEffect(
    () =>
      key.split(',').map(async namespace => loadTranslations(namespace, load)),
    [loadTranslations, key, load],
  )

  return context
}

// https://formatjs.io/docs/intl-messageformat/
const getTranslationFormat = memoizeIntlConstructor(IntlTranslationFormat)
const getNumberFormat = memoizeIntlConstructor(Intl.NumberFormat)
const getDateTimeFormat = memoizeIntlConstructor(Intl.DateTimeFormat)
const getListFormat = memoizeIntlConstructor(Intl.ListFormat)

const loadDateFnsLocale = async locale =>
  import(`date-fns/locale/${locale}/index`)

const I18nContextProvider = ({
  children,
  defaultLoad,
  defaultLocale,
  defaultTranslations,
  enableDefaultLocale,
  enableDebugKey,
  localeItemStorage,
  supportedLocales,
}) => {
  const [currentLocale, setCurrentLocale] = useState(defaultLocale)
  const [locales, setLocales] = useState(supportedLocales)
  const [translations, setTranslations] = useState(defaultTranslations)
  const [dateFnsLocal, setDateFnsLocal] = useState()

  const getLocaleFallback = useCallback(
    locale => locale.split('-')[0].split('_')[0],
    [],
  )

  const getCurrentLocale = useCallback(() => {
    const languages = navigator.languages || [navigator.language]
    const browserLocales = [...new Set(languages.map(getLocaleFallback))]
    const localeStorage = localStorage.getItem(localeItemStorage)

    return (
      localeStorage ||
      browserLocales.find(locale => locales.includes(locale)) ||
      defaultLocale
    )
  }, [defaultLocale, getLocaleFallback, locales, localeItemStorage])

  const loadTranslations = useCallback(
    async (namespace, load = defaultLoad) => {
      const result = {
        defaultLocale: { default: {} },
        [currentLocale]: { default: {} },
      }
      // load default en language
      if (enableDefaultLocale && currentLocale !== defaultLocale) {
        result.defaultLocale = await load({ namespace, locale: defaultLocale })
      }
      result[currentLocale] = await load({
        namespace,
        locale: currentLocale,
      })

      const trad = {
        ...result.defaultLocale.default,
        ...result[currentLocale].default,
      }

      const { prefix, ...values } = trad
      const preparedValues = prefix ? prefixKeys(`${prefix}.`)(values) : values

      setTranslations(prevState => ({
        ...prevState,
        ...{
          [currentLocale]: {
            ...prevState[currentLocale],
            ...preparedValues,
          },
        },
      }))

      return namespace
    },
    [defaultLoad, currentLocale, enableDefaultLocale, defaultLocale],
  )

  const switchLocale = useCallback(
    locale => {
      if (locales.includes(locale)) {
        localStorage.setItem(localeItemStorage, locale)
        setCurrentLocale(locale)
      }
    },
    [setCurrentLocale, locales, localeItemStorage],
  )

  const formatNumber = useCallback(
    (numb, options) => getNumberFormat(currentLocale, options).format(numb),
    [currentLocale],
  )

  const formatList = useCallback(
    (listFormat, options) =>
      getListFormat(currentLocale, options).format(listFormat),
    [currentLocale],
  )

  const datetime = useCallback(
    (date, options) => getDateTimeFormat(currentLocale, options).format(date),
    [currentLocale],
  )

  const relativeTimeStrict = useCallback(
    (date, options = { addSuffix: true, unit: 'day' }) => {
      const finalDate = new Date(date)

      return formatDistanceToNowStrict(finalDate, {
        locale: dateFnsLocal,
        ...options,
      })
    },
    [dateFnsLocal],
  )

  const relativeTime = useCallback(
    (date, options = { addSuffix: true }) => {
      const finalDate = new Date(date)

      return formatDistanceToNow(finalDate, {
        locale: dateFnsLocal,
        ...options,
      })
    },
    [dateFnsLocal],
  )

  const translate = useCallback(
    (key, context) => {
      const value = translations[currentLocale]?.[key]
      if (!value) {
        if (enableDebugKey) {
          return key
        }

        return ''
      }
      if (context) {
        return getTranslationFormat(value, currentLocale).format(context)
      }

      return value
    },
    [currentLocale, translations, enableDebugKey],
  )

  const namespaceTranslation = useCallback(
    (namespace, t = translate) => (identifier, ...args) =>
      t(`${namespace}.${identifier}`, ...args) || t(identifier, ...args),
    [translate],
  )

  useEffect(() => {
    loadDateFnsLocale(currentLocale === 'en' ? 'en-GB' : currentLocale)
      .then(setDateFnsLocal)
      .catch(() => loadDateFnsLocale('en-GB').then(setDateFnsLocal))

    setCurrentLocale(getCurrentLocale())
  }, [currentLocale, getCurrentLocale])

  const value = useMemo(
    () => ({
      currentLocale,
      dateFnsLocal,
      datetime,
      formatNumber,
      formatList,
      loadTranslations,
      locales,
      namespaceTranslation,
      relativeTime,
      relativeTimeStrict,
      setLocales,
      setTranslations,
      switchLocale,
      t: translate,
      translations,
    }),
    [
      currentLocale,
      dateFnsLocal,
      datetime,
      formatNumber,
      formatList,
      loadTranslations,
      locales,
      namespaceTranslation,
      relativeTime,
      relativeTimeStrict,
      setLocales,
      setTranslations,
      switchLocale,
      translate,
      translations,
    ],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

I18nContextProvider.defaultProps = {
  defaultTranslations: {},
  enableDefaultLocale: false,
  localeItemStorage: LOCALE_ITEM_STORAGE,
  enableDebugKey: false,
}

I18nContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultLoad: PropTypes.func.isRequired,
  defaultLocale: PropTypes.string.isRequired,
  defaultTranslations: PropTypes.shape({}),
  enableDebugKey: PropTypes.bool,
  enableDefaultLocale: PropTypes.bool,
  localeItemStorage: PropTypes.string,
  supportedLocales: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default I18nContextProvider
