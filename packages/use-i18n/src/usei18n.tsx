import type { NumberFormatOptions } from '@formatjs/ecma402-abstract'
import type {
  Locale as DateFnsLocale,
  FormatDistanceToNowOptions,
  FormatDistanceToNowStrictOptions,
} from 'date-fns'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { formatDistanceToNowStrict } from 'date-fns/formatDistanceToNowStrict'
import type { BaseLocale } from 'international-types'
import type { ReactElement, ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import dateFormat, { type FormatDateOptions } from './formatDate'
import unitFormat, { type FormatUnitOptions } from './formatUnit'
import formatters, { type IntlListFormatOptions } from './formatters'
import type { ReactParamsObject, ScopedTranslateFn, TranslateFn } from './types'

const LOCALE_ITEM_STORAGE = 'locale'

type SupportedLocalesType<LocalSupportedType extends string> = (
  locale: string,
) => locale is LocalSupportedType

type TranslationsByLocales = Record<string, BaseLocale>
type RequiredGenericContext<
  LocaleParam extends BaseLocale,
  LocalSupportedType extends string,
> = keyof LocaleParam extends never
  ? Omit<
      Context<LocaleParam, LocalSupportedType>,
      't' | 'namespaceTranslation'
    > & {
      t: (str: 'You must pass a generic argument to useI18n()') => void
      namespaceTranslation: (
        str: 'You must pass a generic argument to useI18n()',
      ) => void
    }
  : Context<LocaleParam, LocalSupportedType>

const areNamespacesLoaded = (
  namespaces: string[],
  loadedNamespaces: string[] = [],
) => namespaces.every(n => loadedNamespaces.includes(n))

const getCurrentLocale = <LocalSupportedType extends string>({
  defaultLocale,
  isLocaleSupported,
  localeItemStorage,
}: {
  defaultLocale: LocalSupportedType
  isLocaleSupported: SupportedLocalesType<LocalSupportedType>
  localeItemStorage: string
}): LocalSupportedType => {
  if (typeof window !== 'undefined') {
    const { languages: browserLocales } = navigator
    const currentLocalFromlocalStorage = localStorage.getItem(localeItemStorage)

    if (
      currentLocalFromlocalStorage &&
      isLocaleSupported(currentLocalFromlocalStorage)
    ) {
      return currentLocalFromlocalStorage
    }
    localStorage.removeItem(localeItemStorage)

    const findedBrowserLocal = browserLocales.find(locale =>
      isLocaleSupported(locale),
    )

    if (findedBrowserLocal) {
      localStorage.setItem(localeItemStorage, findedBrowserLocal)

      return findedBrowserLocal
    }

    if (defaultLocale && isLocaleSupported(defaultLocale)) {
      localStorage.setItem(localeItemStorage, defaultLocale)

      return defaultLocale
    }
  }

  return defaultLocale
}

type Context<
  LocaleParam extends BaseLocale,
  LocalSupportedType extends string,
> = {
  currentLocale: LocalSupportedType
  dateFnsLocale?: DateFnsLocale
  datetime: (
    date: Date | number,
    options?: Intl.DateTimeFormatOptions,
  ) => string
  formatDate: (
    value: Date | number | string,
    options?: FormatDateOptions,
  ) => string
  formatList: (listFormat: string[], options?: IntlListFormatOptions) => string
  formatNumber: (numb: number, options?: NumberFormatOptions) => string
  formatUnit: (value: number, options: FormatUnitOptions) => string
  loadTranslations: (
    namespace: string,
    load?: LoadTranslationsFn<LocalSupportedType>,
  ) => Promise<string>
  namespaces: string[]
  namespaceTranslation: ScopedTranslateFn<LocaleParam>
  relativeTime: (
    date: Date | number,
    options?: FormatDistanceToNowOptions,
  ) => string
  relativeTimeStrict: (
    date: Date | number,
    options?: FormatDistanceToNowStrictOptions,
  ) => string
  setTranslations: React.Dispatch<React.SetStateAction<TranslationsByLocales>>
  switchLocale: (locale: LocalSupportedType) => Promise<void>
  t: TranslateFn<LocaleParam>
  translations: TranslationsByLocales
}

// It's safe to use any here because the Locale can be anything at this point:
// useI18n / useTranslation requires to explicitely give a Locale to use.
const I18nContext = createContext<Context<any, any> | undefined>(undefined)

export function useI18n<
  // eslint-disable-next-line @typescript-eslint/ban-types
  LocaleParam extends BaseLocale = {},
  LocalSupportedType extends string = '',
>(): RequiredGenericContext<LocaleParam, LocalSupportedType> {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within a I18nProvider')
  }

  return context as unknown as RequiredGenericContext<
    LocaleParam,
    LocalSupportedType
  >
}

export function useTranslation<
  // eslint-disable-next-line @typescript-eslint/ban-types
  LocaleParam extends BaseLocale = {},
  LocalSupportedType extends string = '',
>(
  namespaces: string[] = [],
  load: LoadTranslationsFn<LocalSupportedType> | undefined = undefined,
): RequiredGenericContext<LocaleParam, LocalSupportedType> & {
  isLoaded: boolean
} {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a I18nProvider')
  }
  const { loadTranslations, namespaces: loadedNamespaces } = context

  const key = namespaces.join(',')
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    key
      .split(',')
      .map(async (namespace: string) => loadTranslations(namespace, load))
  }, [loadTranslations, key, load])

  const isLoaded = useMemo(
    () => areNamespacesLoaded(namespaces, loadedNamespaces),
    [loadedNamespaces, namespaces],
  )

  return {
    ...context,
    isLoaded,
  } as unknown as RequiredGenericContext<LocaleParam, LocalSupportedType> & {
    isLoaded: boolean
  }
}

type LoadTranslationsFn<LocalSupportedType extends string> = ({
  namespace,
  locale,
}: {
  namespace: string
  locale: LocalSupportedType
}) => Promise<{ default: BaseLocale }>

type LoadLocaleFn<LocalSupportedType extends string> = (
  locale: LocalSupportedType,
) => DateFnsLocale
type LoadLocaleFnAsync<LocalSupportedType extends string> = (
  locale: LocalSupportedType,
) => Promise<DateFnsLocale>
type LoadDateLocaleError = (error: Error) => void

const initialDefaultTranslations = {}

const I18nContextProvider = <LocalSupportedType extends string>({
  children,
  defaultLoad,
  defaultLocale,
  defaultTranslations = initialDefaultTranslations,
  enableDebugKey = false,
  enableDefaultLocale = false,
  loadDateLocale,
  loadDateLocaleAsync,
  localeItemStorage = LOCALE_ITEM_STORAGE,
  onLoadDateLocaleError,
  onTranslateError,
  isLocaleSupported,
}: {
  children: ReactNode
  defaultLoad: LoadTranslationsFn<LocalSupportedType>
  loadDateLocale?: LoadLocaleFn<LocalSupportedType>
  loadDateLocaleAsync: LoadLocaleFnAsync<LocalSupportedType>
  onLoadDateLocaleError?: LoadDateLocaleError
  defaultLocale: LocalSupportedType
  defaultTranslations: TranslationsByLocales
  enableDefaultLocale: boolean
  enableDebugKey: boolean
  localeItemStorage: string
  isLocaleSupported: SupportedLocalesType<LocalSupportedType>
  onTranslateError?: ({
    error,
    currentLocale,
    value,
    key,
  }: {
    error: Error
    currentLocale: LocalSupportedType
    defaultLocale: LocalSupportedType
    value: string
    key: string
  }) => void
}): ReactElement => {
  const [currentLocale, setCurrentLocale] = useState<LocalSupportedType>(
    getCurrentLocale({
      defaultLocale,
      localeItemStorage,
      isLocaleSupported,
    }),
  )
  const [translations, setTranslations] =
    useState<TranslationsByLocales>(defaultTranslations)
  const [namespaces, setNamespaces] = useState<string[]>([])

  const [dateFnsLocale, setDateFnsLocale] = useState<DateFnsLocale | undefined>(
    loadDateLocale?.(currentLocale) ?? undefined,
  )

  const loadDateFNS = loadDateLocale ?? loadDateLocaleAsync

  const setDateFns = useCallback(
    async (locale: LocalSupportedType) => {
      try {
        const dateFns = await loadDateFNS(locale)
        setDateFnsLocale(dateFns)
      } catch (err) {
        if (err instanceof Error && onLoadDateLocaleError) {
          onLoadDateLocaleError(err)
        }

        setDateFnsLocale(dateFnsLocale)
      }
    },
    [loadDateFNS, setDateFnsLocale, onLoadDateLocaleError, dateFnsLocale],
  )

  /**
   *  At first render when we find a local on the localStorage which is not the same as the default,
   *  we should switch also the date-fns local related to the current local.
   *  As the method is async, we obviously need a useEffect to apply this change...
   * */

  useEffect(() => {
    if (!dateFnsLocale) {
      setDateFns(currentLocale)
        .then()
        .catch(() => null)
    }
  }, [currentLocale, dateFnsLocale, setDateFns, setDateFnsLocale])

  const loadTranslations = useCallback(
    async (
      namespace: string,
      load: LoadTranslationsFn<LocalSupportedType> = defaultLoad,
    ) => {
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

      const trad: Record<string, string> = {
        ...result.defaultLocale.default,
        ...result[currentLocale].default,
      }

      setTranslations(prevState => ({
        ...prevState,
        [defaultLocale]: {
          ...prevState[defaultLocale],
          ...result.defaultLocale.default,
        },
        [currentLocale]: {
          ...prevState[currentLocale],
          ...trad,
        },
      }))

      setNamespaces(prevState => [...new Set([...prevState, namespace])])

      return namespace
    },
    [defaultLoad, currentLocale, enableDefaultLocale, defaultLocale],
  )

  const switchLocale = useCallback(
    async (locale: LocalSupportedType) => {
      if (isLocaleSupported(locale)) {
        localStorage.setItem(localeItemStorage, locale)
        setCurrentLocale(locale)
        await setDateFns(locale)
      }
    },
    [setDateFns, localeItemStorage, setCurrentLocale, isLocaleSupported],
  )

  const formatNumber = useCallback(
    (numb: number, options?: NumberFormatOptions) =>
      formatters.getNumberFormat(currentLocale, options).format(numb),
    [currentLocale],
  )

  const formatList = useCallback(
    (listFormat: string[], options?: IntlListFormatOptions) =>
      formatters.getListFormat(currentLocale, options).format(listFormat),
    [currentLocale],
  )

  // This a temporary method
  // Once https://github.com/tc39/proposal-smart-unit-preferences is stable we should
  // be able to use formatNumber directly
  const formatUnit = useCallback(
    (value: number, options: FormatUnitOptions) =>
      unitFormat(currentLocale, value, options),
    [currentLocale],
  )

  const formatDate = useCallback(
    (value: Date | number | string, options: FormatDateOptions = 'short') =>
      dateFormat(currentLocale, value, options),
    [currentLocale],
  )

  const datetime = useCallback(
    (date: Date | number, options?: Intl.DateTimeFormatOptions): string =>
      formatters.getDateTimeFormat(currentLocale, options).format(date),
    [currentLocale],
  )

  const relativeTimeStrict = useCallback(
    (
      date: Date | number,
      options: FormatDistanceToNowStrictOptions = {
        addSuffix: true,
        unit: 'day',
      },
    ) => {
      const finalDate = new Date(date)

      return formatDistanceToNowStrict(finalDate, {
        locale: dateFnsLocale,
        ...options,
      })
    },
    [dateFnsLocale],
  )

  const relativeTime = useCallback(
    (
      date: Date | number,
      options: FormatDistanceToNowOptions = { addSuffix: true },
    ) => {
      const finalDate = new Date(date)

      return formatDistanceToNow(finalDate, {
        locale: dateFnsLocale,
        ...options,
      })
    },
    [dateFnsLocale],
  )

  const translate = useCallback(
    (key: string, context?: ReactParamsObject<any>) => {
      const value = translations[currentLocale]?.[key] as string

      if (enableDebugKey) {
        return key
      }

      if (!value) {
        return ''
      }

      if (context) {
        try {
          return formatters
            .getTranslationFormat(value, currentLocale)
            .format(context) as string
        } catch (err) {
          onTranslateError?.({
            error: err as Error,
            currentLocale,
            defaultLocale,
            value,
            key,
          })

          // with default locale nothing should break or it's normal to not ignore it.
          const defaultValue = translations[defaultLocale]?.[key] as string

          return formatters
            .getTranslationFormat(defaultValue, defaultLocale)
            .format(context) as string
        }
      }

      return value
    },
    [
      currentLocale,
      translations,
      enableDebugKey,
      defaultLocale,
      onTranslateError,
    ],
  )

  const namespaceTranslation = useCallback(
    (scope: string, t = translate) =>
      (key: string, context?: ReactParamsObject<any>) =>
        t(`${scope}.${key}`, context) || t(key, context),
    [translate],
  )

  const value = useMemo(
    () => ({
      currentLocale,
      dateFnsLocale,
      datetime,
      formatDate,
      formatList,
      formatNumber,
      formatUnit,
      loadTranslations,
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
      formatDate,
      formatList,
      formatNumber,
      formatUnit,
      loadTranslations,
      namespaceTranslation,
      namespaces,
      relativeTime,
      relativeTimeStrict,
      setTranslations,
      switchLocale,
      translate,
      translations,
    ],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export default I18nContextProvider
