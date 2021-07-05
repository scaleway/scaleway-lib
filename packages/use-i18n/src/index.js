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
import ReactDOM from 'react-dom'
import 'intl-pluralrules'

const LOCALE_ITEM_STORAGE = 'locale'

const prefixKeys = prefix => obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[prefix + key] = obj[key]

    return acc
  }, {})

const areNamespacesLoaded = (namespaces, loadedNamespaces) =>
  namespaces.every(n => loadedNamespaces.includes(n))

const getLocaleFallback = locale => locale.split('-')[0].split('_')[0]

const getCurrentLocale = ({
  defaultLocale,
  supportedLocales,
  localeItemStorage,
}) => {
  const languages = navigator.languages || [navigator.language]
  const browserLocales = [...new Set(languages.map(getLocaleFallback))]
  const localeStorage = localStorage.getItem(localeItemStorage)

  return (
    localeStorage ||
    browserLocales.find(locale => supportedLocales.includes(locale)) ||
    defaultLocale
  )
}

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
  const { loadTranslations, namespaces: loadedNamespaces } = context

  const key = namespaces.join(',')
  useEffect(() => {
    key.split(',').map(async namespace => loadTranslations(namespace, load))
  }, [loadTranslations, key, load])

  const isLoaded = useMemo(
    () => areNamespacesLoaded(namespaces, loadedNamespaces),
    [loadedNamespaces, namespaces],
  )

  return { ...context, isLoaded }
}

// https://formatjs.io/docs/intl-messageformat/
const getTranslationFormat = memoizeIntlConstructor(IntlTranslationFormat)
const getNumberFormat = memoizeIntlConstructor(Intl.NumberFormat)
const getDateTimeFormat = memoizeIntlConstructor(Intl.DateTimeFormat)
const getListFormat = memoizeIntlConstructor(Intl.ListFormat)

const I18nContextProvider = ({
  children,
  defaultLoad,
  loadDateLocale,
  defaultLocale,
  defaultTranslations,
  enableDefaultLocale,
  enableDebugKey,
  localeItemStorage,
  supportedLocales,
}) => {
  const [currentLocale, setCurrentLocale] = useState(
    getCurrentLocale({ defaultLocale, localeItemStorage, supportedLocales }),
  )
  const [translations, setTranslations] = useState(defaultTranslations)
  const [namespaces, setNamespaces] = useState([])
  const [dateFnsLocale, setDateFnsLocale] = useState()

  useEffect(() => {
    loadDateLocale(currentLocale === 'en' ? 'en-GB' : currentLocale)
      .then(setDateFnsLocale)
      .catch(() => loadDateLocale('en-GB').then(setDateFnsLocale))
  }, [loadDateLocale, currentLocale])

  const loadTranslations = useCallback(
    async (namespace, load = defaultLoad) => {
      const result = {
        [currentLocale]: { default: {} },
        defaultLocale: { default: {} },
      }
      // load default en language
      if (enableDefaultLocale && currentLocale !== defaultLocale) {
        result.defaultLocale = await load({
          locale: defaultLocale,
          namespace,
        })
      }
      result[currentLocale] = await load({
        locale: currentLocale,
        namespace,
      })

      const trad = {
        ...result.defaultLocale.default,
        ...result[currentLocale].default,
      }

      const { prefix, ...values } = trad
      const preparedValues = prefix ? prefixKeys(`${prefix}.`)(values) : values

      // avoid a lot of render when async update
      ReactDOM.unstable_batchedUpdates(() => {
        setTranslations(prevState => ({
          ...prevState,
          ...{
            [currentLocale]: {
              ...prevState[currentLocale],
              ...preparedValues,
            },
          },
        }))

        setNamespaces(prevState => [
          ...new Set([...(prevState || []), namespace]),
        ])
      })

      return namespace
    },
    [defaultLoad, currentLocale, enableDefaultLocale, defaultLocale],
  )

  const switchLocale = useCallback(
    locale => {
      if (supportedLocales.includes(locale)) {
        localStorage.setItem(localeItemStorage, locale)
        setCurrentLocale(locale)
      }
    },
    [localeItemStorage, setCurrentLocale, supportedLocales],
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
        locale: dateFnsLocale,
        ...options,
      })
    },
    [dateFnsLocale],
  )

  const relativeTime = useCallback(
    (date, options = { addSuffix: true }) => {
      const finalDate = new Date(date)

      return formatDistanceToNow(finalDate, {
        locale: dateFnsLocale,
        ...options,
      })
    },
    [dateFnsLocale],
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
    (namespace, t = translate) =>
      (identifier, ...args) =>
        t(`${namespace}.${identifier}`, ...args) || t(identifier, ...args),
    [translate],
  )

  const value = useMemo(
    () => ({
      currentLocale,
      dateFnsLocale,
      datetime,
      formatList,
      formatNumber,
      loadTranslations,
      locales: supportedLocales,
      namespaces,
      namespaceTranslation,
      relativeTime,
      relativeTimeStrict,
      setTranslations,
      switchLocale,
      t: translate,
      translations,
    }),
    [
      currentLocale,
      dateFnsLocale,
      datetime,
      formatList,
      formatNumber,
      loadTranslations,
      namespaceTranslation,
      namespaces,
      relativeTime,
      relativeTimeStrict,
      setTranslations,
      supportedLocales,
      switchLocale,
      translate,
      translations,
    ],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

I18nContextProvider.defaultProps = {
  defaultTranslations: {},
  enableDebugKey: false,
  enableDefaultLocale: false,
  localeItemStorage: LOCALE_ITEM_STORAGE,
}

I18nContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultLoad: PropTypes.func.isRequired,
  defaultLocale: PropTypes.string.isRequired,
  defaultTranslations: PropTypes.shape({}),
  enableDebugKey: PropTypes.bool,
  enableDefaultLocale: PropTypes.bool,
  loadDateLocale: PropTypes.func.isRequired,
  localeItemStorage: PropTypes.string,
  supportedLocales: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default I18nContextProvider
