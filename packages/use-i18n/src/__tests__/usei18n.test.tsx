import { act, renderHook } from '@testing-library/react'
import { enGB, fr as frDateFns } from 'date-fns/locale'
import { MissingValueError } from 'intl-messageformat'
import type { ComponentProps, ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import I18n, { useI18n, useTranslation } from '..'
import type { LoadTranslationsFn } from '..'
import en from './locales/en'
import es from './locales/es'
import fr from './locales/fr'

const LOCALE_ITEM_STORAGE = 'locales'

const ListLocales = ['es', 'en', 'fr', 'fr-FR', 'en-GB'] as const
type Locales = (typeof ListLocales)[number]

type Locale = typeof en
type NamespaceLocale = {
  name: 'Name'
  lastName: 'Last Name'
  languages: 'Languages'
}

type OnTranslateError = ComponentProps<typeof I18n>['onTranslateError']
type OnLoadTranslationError = ComponentProps<typeof I18n>['onLoadTranslationError']

const isDefaultLocalesSupported = (locale: string): locale is Locales => ListLocales.includes(locale as Locales)

const load = async ({ locale, namespace }: { locale: string; namespace: string }) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  import(`./locales/namespaces/${locale}/${namespace}.json`)

const CustomComponent = ({ children }: { children: ReactNode }) => <p style={{ fontWeight: 'bold' }}>{children}</p>

const defaultOnTranslateError: OnTranslateError = () => {}
const defaultOnLoadTranslationError: OnLoadTranslationError = () => {}

const wrapper =
  ({
    loadDateLocaleAsync = async (locale: string) => {
      if (locale === 'en') {
        return (await import('date-fns/locale/en-GB')).enGB
      }
      if (locale === 'fr') {
        return (await import('date-fns/locale/fr')).fr
      }

      if (locale === 'es') {
        return (await import('date-fns/locale/es')).es
      }

      return (await import('date-fns/locale/en-GB')).enGB
    },
    loadDateLocale = (locale: string) => {
      if (locale === 'en') {
        return enGB
      }
      if (locale === 'fr') {
        return frDateFns
      }

      return enGB
    },

    defaultLoad = async ({ locale }: { locale: string }) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      import(`./locales/${locale}.ts`),
    defaultLocale = 'en',
    defaultTranslations = {},
    enableDebugKey = false,
    enableDefaultLocale = false,
    localeItemStorage = LOCALE_ITEM_STORAGE,
    isLocaleSupported = isDefaultLocalesSupported,
    onTranslateError = defaultOnTranslateError,
    onLoadTranslationError = defaultOnLoadTranslationError,
  } = {}) =>
  ({ children }: { children: ReactNode }) => (
    <I18n
      defaultLoad={defaultLoad}
      defaultLocale={defaultLocale}
      defaultTranslations={defaultTranslations}
      enableDebugKey={enableDebugKey}
      enableDefaultLocale={enableDefaultLocale}
      isLocaleSupported={isLocaleSupported}
      loadDateLocale={loadDateLocale}
      loadDateLocaleAsync={loadDateLocaleAsync}
      localeItemStorage={localeItemStorage}
      onTranslateError={onTranslateError}
      onLoadTranslationError={onLoadTranslationError}
    >
      {children}
    </I18n>
  )

describe('i18n hook', () => {
  beforeEach(() => {
    vi.spyOn(window, 'navigator', 'get').mockReturnValue({
      language: 'en-US',
      languages: ['en-US', 'en'],
    } as unknown as Navigator)
    vi.useFakeTimers()
  })

  afterEach(() => {
    localStorage.clear()
    vi.useRealTimers()
  })

  it('useTranslation should not be defined without I18nProvider', () => {
    expect.hasAssertions()
    const spy = vi.spyOn(console, 'error')
    spy.mockImplementation(() => {})

    expect(() => renderHook(() => useTranslation(['test']))).toThrow(
      new Error('useTranslation must be used within a I18nProvider'),
    )
    spy.mockRestore()
  })

  it('useI18n should not be defined without I18nProvider', () => {
    expect.hasAssertions()
    const spy = vi.spyOn(console, 'error')
    spy.mockImplementation(() => {})

    expect(() => renderHook(() => useI18n())).toThrow(new Error('useI18n must be used within a I18nProvider'))
    spy.mockRestore()
  })

  it('should use defaultLoad, useTranslation, switch local and translate', async () => {
    const { result } = renderHook(() => useTranslation<Locale, Locales>(['test']), {
      wrapper: wrapper({ defaultLocale: 'en' }),
    })
    // first render there is no load
    expect(result.current.t('title')).toBe('')

    await vi.waitFor(() => {
      // after load of en locale
      expect(result.current.t('title')).toStrictEqual(en.title)
    })

    await act(async () => {
      await result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.t('title')).toStrictEqual(fr.title)
    })

    await act(async () => {
      await result.current.switchLocale('es')
    })

    await vi.waitFor(() => {
      expect(result.current.t('title')).toStrictEqual(es.title)
    })
  })

  it('should use specific load on useTranslation', async () => {
    const { result } = renderHook(() => useTranslation<NamespaceLocale, Locales>(['user', 'profile'], load), {
      wrapper: wrapper({
        defaultLocale: 'en',
        isLocaleSupported: isDefaultLocalesSupported,
      }),
    })

    await vi.waitFor(() => {
      expect(result.current.translations).toStrictEqual({
        en: {
          languages: 'Languages',
          lastName: 'Last Name',
          name: 'Name',
        },
      })
    })

    expect(result.current.t('name')).toBe('Name')
    expect(result.current.t('lastName')).toBe('Last Name')
    expect(result.current.t('languages')).toBe('Languages')

    await act(async () => {
      await result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.translations).toStrictEqual({
        en: {
          languages: 'Languages',
          lastName: 'Last Name',
          name: 'Name',
        },
        fr: {
          lastName: 'Nom',
          name: 'Prénom',
        },
      })
    })

    expect(result.current.t('name')).toBe('Prénom')
    expect(result.current.t('lastName')).toBe('Nom')
    expect(result.current.t('languages')).toBe('')
  })

  it("should use specific load and fallback default local if the key doesn't exist", async () => {
    const { result } = renderHook(() => useTranslation<NamespaceLocale, Locales>(['user'], load), {
      wrapper: wrapper({
        defaultLocale: 'fr',
        enableDefaultLocale: true,
        isLocaleSupported: isDefaultLocalesSupported,
      }),
    })

    // current local will be 'en' based on navigator
    // await load of locales
    await act(async () => {
      await result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.translations).toStrictEqual({
        en: {
          languages: 'Languages',
          lastName: 'Last Name',
          name: 'Name',
        },
        fr: {
          lastName: 'Nom',
          name: 'Prénom',
        },
      })

      expect(result.current.t('languages')).toBe('')
      expect(result.current.t('lastName')).toBe('Nom')
      expect(result.current.t('name')).toBe('Prénom')
    })
  })

  it('should set current locale from defaultLocale', async () => {
    expect.hasAssertions()
    const { result } = renderHook(() => useI18n(), {
      wrapper: wrapper({
        defaultLocale: 'fr',
        isLocaleSupported: isDefaultLocalesSupported,
      }),
    })

    await vi.waitFor(() => {
      expect(result.current.currentLocale).toBe('en')
    })
  })

  it('should work with a component', async () => {
    const { result } = renderHook(() => useTranslation<{ 'with.identifier': 'Hello {identifier}' }>(['test']), {
      wrapper: wrapper({ defaultLocale: 'en' }),
    })

    await vi.waitFor(() => {
      expect(
        result.current.t('with.identifier', {
          identifier: <b key="1">My resource</b>,
        }),
      ).toStrictEqual(['Are you sure you want to delete ', <b key="1">My resource</b>, '?'])
      expect(
        result.current.t('with.identifier', {
          identifier: <CustomComponent key="1">My resource</CustomComponent>,
        }),
      ).toStrictEqual(['Are you sure you want to delete ', <CustomComponent key="1">My resource</CustomComponent>, '?'])
    })
  })

  describe('getCurrentLocale', () => {
    it('should set current locale from localStorage', async () => {
      vi.spyOn(global, 'navigator', 'get').mockReturnValueOnce({
        languages: ['fr'],
      } as unknown as Navigator)
      const mockGetItem = vi.fn().mockReturnValue('en')
      const mockSetItem = vi.fn()
      const mockRemoveItem = vi.fn()
      const localStorageMock = vi.spyOn(global, 'localStorage', 'get').mockReturnValue({
        clear: vi.fn(),
        getItem: mockGetItem,
        removeItem: mockRemoveItem,
        setItem: mockSetItem,
      } as unknown as Storage)

      const { result } = renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'es',
          isLocaleSupported: isDefaultLocalesSupported,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.currentLocale).toBe('en')
        expect(mockGetItem).toHaveBeenCalledOnce()
        expect(mockGetItem).toHaveBeenCalledWith(LOCALE_ITEM_STORAGE)
      })
      localStorageMock.mockRestore()
    })

    it('should not set current locale from localStorage when this value is not supported', async () => {
      vi.spyOn(global, 'navigator', 'get').mockReturnValueOnce({
        languages: ['bz'],
      } as unknown as Navigator)
      const mockGetItem = vi.fn().mockReturnValue('re')
      const mockSetItem = vi.fn()
      const mockRemoveItem = vi.fn()
      const localStorageMock = vi.spyOn(global, 'localStorage', 'get').mockReturnValue({
        clear: vi.fn(),
        getItem: mockGetItem,
        removeItem: mockRemoveItem,
        setItem: mockSetItem,
      } as unknown as Storage)

      const { result } = renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'en',
          isLocaleSupported: isDefaultLocalesSupported,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.currentLocale).toBe('en')
        expect(mockGetItem).toHaveBeenCalledOnce()
        expect(mockGetItem).toHaveBeenCalledWith(LOCALE_ITEM_STORAGE)
      })
      localStorageMock.mockRestore()
    })

    it('should set current locale from navigator', async () => {
      vi.spyOn(global, 'navigator', 'get').mockReturnValueOnce({
        languages: ['fr'],
      } as unknown as Navigator)
      const mockGetItem = vi.fn()
      const mockSetItem = vi.fn()
      const mockRemoveItem = vi.fn()
      const localStorageMock = vi.spyOn(global, 'localStorage', 'get').mockReturnValueOnce({
        clear: vi.fn(),
        getItem: mockGetItem,
        removeItem: mockRemoveItem,
        setItem: mockSetItem,
      } as unknown as Storage)

      const { result } = renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'es',
          isLocaleSupported: isDefaultLocalesSupported,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.currentLocale).toBe('fr')
      })
      localStorageMock.mockRestore()
    })

    it('should set current locale from defaultLocale', async () => {
      vi.spyOn(global, 'navigator', 'get').mockReturnValueOnce({
        languages: [],
      } as unknown as Navigator)
      const mockGetItem = vi.fn()
      const mockSetItem = vi.fn()
      const mockRemoveItem = vi.fn()
      const localStorageMock = vi.spyOn(global, 'localStorage', 'get').mockReturnValueOnce({
        clear: vi.fn(),
        getItem: mockGetItem,
        removeItem: mockRemoveItem,
        setItem: mockSetItem,
      } as unknown as Storage)

      const { result } = renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'es',
          isLocaleSupported: isDefaultLocalesSupported,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.currentLocale).toBe('es')
      })
      localStorageMock.mockRestore()
    })
  })

  it('should switch locale', async () => {
    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
        isLocaleSupported: isDefaultLocalesSupported,
      }),
    })
    expect(result.current.currentLocale).toBe('en')
    expect(localStorage.getItem(LOCALE_ITEM_STORAGE)).toBe('en')

    await act(async () => {
      await result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.currentLocale).toBe('fr')
    })
    expect(localStorage.getItem(LOCALE_ITEM_STORAGE)).toBe('fr')

    await act(async () => {
      await result.current.switchLocale('es')
    })

    await vi.waitFor(() => {
      expect(result.current.currentLocale).toBe('es')
    })
    expect(localStorage.getItem(LOCALE_ITEM_STORAGE)).toBe('es')

    await act(async () => {
      // we test even if an incorrect typescript value is being passed to the function

      // @ts-expect-error expected error
      await result.current.switchLocale('test')
    })

    await vi.waitFor(() => {
      expect(result.current.currentLocale).toBe('es')
    })
    expect(localStorage.getItem(LOCALE_ITEM_STORAGE)).toBe('es')
  })

  it('should translate correctly with enableDebugKey and return key', async () => {
    const { result } = renderHook(() => useI18n<Locale>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
        defaultTranslations: { en },
        enableDebugKey: true,
        isLocaleSupported: isDefaultLocalesSupported,
      }),
    })

    // @ts-expect-error this key doesn't exist but enable debug key will return the key
    expect(result.current.t('test')).toBe('test')

    await vi.waitFor(() => {
      expect(result.current.t('title')).toBe('title')
      expect(result.current.t('subtitle')).toBe('subtitle')
      expect(result.current.t('plurals', { count: 0 })).toBe('plurals')
      expect(result.current.t('plurals', { count: 1 })).toBe('plurals')
      expect(result.current.t('plurals', { count: 2 })).toBe('plurals')
    })
  })

  it('should call onTranslateError when there is a sync issue to remove/add variable in one traduction of a language', async () => {
    const mockOnTranslateError = vi.fn(() => {})

    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
        defaultTranslations: { en, fr },
        isLocaleSupported: isDefaultLocalesSupported,
        onTranslateError: mockOnTranslateError,
      }),
    })

    await act(async () => {
      await result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.currentLocale).toBe('fr')
    })

    const newVariable = 'newVariable'
    expect(result.current.t('translate.error', { newVariable: 'newVariable' })).toBe(
      `On translate sync issue with variable between locales ${newVariable}`,
    )

    expect(mockOnTranslateError).toHaveBeenCalledOnce()

    expect(mockOnTranslateError).toHaveBeenCalledWith(
      expect.objectContaining({
        currentLocale: 'fr',
        defaultLocale: 'en',
        error: expect.any(MissingValueError) as unknown as MissingValueError,
        key: 'translate.error',
        value: 'onTranslateError fonction sera appelé car il manque une variable en français {oldFrenchVariable}',
      }),
    )

    const oldFrenchVariable = 'cette variable fonctionne'
    expect(
      result.current.t('translate.error', {
        // @ts-expect-error this variable doesn't exist in english anymore but still in french locales
        oldFrenchVariable,
      }),
    ).toBe(`onTranslateError fonction sera appelé car il manque une variable en français ${oldFrenchVariable}`)
  })

  it('should use namespaceTranslation', async () => {
    const { result } = renderHook(() => useI18n<Locale>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
        defaultTranslations: { en },
      }),
    })
    await vi.waitFor(() => {
      const identiqueTranslate = result.current.namespaceTranslation('tests')
      expect(identiqueTranslate('test.namespaces')).toStrictEqual(result.current.t('tests.test.namespaces'))
    })

    const translate = result.current.namespaceTranslation('tests.test')
    expect(translate('namespaces')).toBe('test')
  })

  it('should use formatNumber', async () => {
    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
      }),
    })
    expect(result.current.formatNumber(2)).toBe('2')
    expect(
      result.current.formatNumber(2, {
        currency: 'EUR',
        currencyDisplay: 'symbol',
        style: 'currency',
      }),
    ).toBe('€2.00')

    expect(
      result.current.formatNumber(2, {
        currency: 'USD',
        currencyDisplay: 'symbol',
        style: 'currency',
      }),
    ).toBe('$2.00')

    await act(async () => {
      await result.current.switchLocale('fr')
    })

    // https://stackoverflow.com/questions/58769806/identical-strings-not-matching-in-vi
    // https://stackoverflow.com/questions/54242039/intl-numberformat-space-character-does-not-match

    await vi.waitFor(() => {
      expect(
        result.current.formatNumber(2, {
          currency: 'EUR',
          style: 'currency',
        }),
      ).toBe('2,00\u00A0€')
    })

    expect(result.current.formatNumber(2, { currency: 'USD', style: 'currency' })).toBe('2,00\u00A0$US')
  })

  it('should use formatList', async () => {
    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
      }),
    })
    const vehicles = ['Motorcycle', 'Bus', 'Car']

    expect(
      result.current.formatList(vehicles, {
        style: 'long',
        type: 'conjunction',
      }),
    ).toBe('Motorcycle, Bus, and Car')

    expect(
      result.current.formatList(vehicles, {
        style: 'short',
        type: 'disjunction',
      }),
    ).toBe('Motorcycle, Bus, or Car')

    expect(
      result.current.formatList(vehicles, {
        style: 'narrow',
        type: 'unit',
      }),
    ).toBe('Motorcycle Bus Car')

    await act(async () => {
      await result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(
        result.current.formatList(vehicles, {
          style: 'long',
          type: 'conjunction',
        }),
      ).toBe('Motorcycle, Bus et Car')
    })

    expect(
      result.current.formatList(vehicles, {
        style: 'short',
        type: 'disjunction',
      }),
    ).toBe('Motorcycle, Bus ou Car')

    expect(
      result.current.formatList(vehicles, {
        style: 'narrow',
        type: 'unit',
      }),
    ).toBe('Motorcycle Bus Car')
  })

  it('should use datetime', async () => {
    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
      }),
    })
    const date = new Date('December 17, 1995 03:24:00')

    await vi.waitFor(() => {
      expect(result.current.datetime(date)).toBe('12/17/1995')
    })

    expect(
      result.current.datetime(date, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }),
    ).toBe('12/17/1995')

    expect(
      result.current.datetime(date, {
        day: '2-digit',
        era: 'short',
        month: 'short',
        year: 'numeric',
      }),
    ).toBe('Dec 17, 1995 AD')

    expect(
      result.current.datetime(date, {
        day: '2-digit',
        era: 'long',
        month: 'long',
        year: 'numeric',
      }),
    ).toBe('December 17, 1995 Anno Domini')

    expect(
      result.current.datetime(date, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }),
    ).toBe('12/17/1995')

    await act(async () => {
      await result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.datetime(date)).toBe('17/12/1995')
    })

    expect(
      result.current.datetime(date, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }),
    ).toBe('17/12/1995')

    expect(
      result.current.datetime(date, {
        day: '2-digit',
        era: 'long',
        month: 'long',
        year: 'numeric',
      }),
    ).toBe('17 décembre 1995 après Jésus-Christ')
  })

  it('should relativeTime', async () => {
    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
      }),
    })
    vi.setSystemTime(new Date('4/13/2021'))
    const date = new Date('September 13, 2000 15:15:00')

    expect(result.current.relativeTime(date)).toBe('over 20 years ago')

    await act(async () => {
      await result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.dateFnsLocale?.code).toBe('fr')
      expect(result.current.relativeTime(date)).toBe('il y a plus de 20 ans')
    })
  })

  it('should relativeTimeStrict', async () => {
    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
      }),
    })
    vi.setSystemTime(new Date('4/13/2021'))
    const date = new Date('September 13, 2011 15:15:00')

    expect(result.current.relativeTimeStrict(date)).toBe('3499 days ago')
    await act(async () => {
      await result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.relativeTimeStrict(date)).toBe('il y a 3499 jours')
    })
  })

  it('should formatUnit', async () => {
    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
      }),
    })

    expect(result.current.formatUnit(12, { short: false, unit: 'byte' })).toBe('12 bytes')
    await act(async () => {
      await result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.formatUnit(12, { short: false, unit: 'byte' })).toBe('12 octets')
    })
  })

  it('should formatDate', async () => {
    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
      }),
    })

    expect(result.current.formatDate(new Date(2020, 1, 13, 16, 28), 'numericHour')).toBe('2020-02-13 4:28 PM')
    await act(async () => {
      await result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.formatDate(new Date(2020, 1, 13, 16, 28), 'numericHour')).toBe('2020-02-13 16:28')
    })
  })

  describe('date-fns', () => {
    it('should load default date-fns locales', async () => {
      const { result } = renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'test',
          isLocaleSupported: isDefaultLocalesSupported,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.dateFnsLocale?.code).toBe('en-GB')
      })
    })

    it('should load correct date-fns based on current local', async () => {
      vi.spyOn(global, 'navigator', 'get').mockReturnValueOnce({
        languages: ['fr'],
      } as unknown as Navigator)
      const mockGetItem = vi.fn().mockReturnValue('fr')
      const mockSetItem = vi.fn()
      const mockRemoveItem = vi.fn()
      const localStorageMock = vi.spyOn(global, 'localStorage', 'get').mockReturnValue({
        clear: vi.fn(),
        getItem: mockGetItem,
        removeItem: mockRemoveItem,
        setItem: mockSetItem,
      } as unknown as Storage)

      const { result } = renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'es',
          isLocaleSupported: isDefaultLocalesSupported,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.currentLocale).toBe('fr')
        expect(mockGetItem).toHaveBeenCalledOnce()
        expect(mockGetItem).toHaveBeenCalledWith(LOCALE_ITEM_STORAGE)
      })

      await vi.waitFor(() => {
        expect(result.current.dateFnsLocale?.code).toBe('fr')
        expect(result.current.dateFnsLocale).toMatchObject({ code: 'fr' })
      })

      localStorageMock.mockRestore()
    })
  })

  describe('onLoadTranslationError', () => {
    it('should call onLoadTranslationError when loading translation fails for current locale', async () => {
      expect.hasAssertions()
      const mockOnLoadTranslationError = vi.fn<OnLoadTranslationError>()
      const mockLoad = vi.fn<LoadTranslationsFn<Locales>>().mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useTranslation<Locale, Locales>(['test'], mockLoad), {
        wrapper: wrapper({
          defaultLocale: 'en',
          onLoadTranslationError: mockOnLoadTranslationError,
        }),
      })

      await vi.waitFor(() => {
        expect(mockOnLoadTranslationError).toHaveBeenCalledOnce()
        expect(mockOnLoadTranslationError).toHaveBeenCalledWith(expect.any(Error))
      })

      const error = mockOnLoadTranslationError.mock.calls[0]?.[0]
      expect(error).toBeDefined()
      expect((error as Error).message).toBe('Network error')

      expect(result.current.t('title')).toBe('')
    })

    it('should call onLoadTranslationError when loading translation fails for default locale', async () => {
      expect.hasAssertions()
      const mockOnLoadTranslationError = vi.fn<OnLoadTranslationError>()
      const mockLoad = vi.fn<LoadTranslationsFn<Locales>>().mockImplementation(({ locale }) => {
        if (locale === 'en') {
          return Promise.reject(new Error('Default locale load failed'))
        }
        return Promise.resolve({ default: { title: 'Titre en français' } })
      })

      const { result } = renderHook(() => useTranslation<Locale, Locales>(['test'], mockLoad), {
        wrapper: wrapper({
          defaultLocale: 'en',
          enableDefaultLocale: true,
          onLoadTranslationError: mockOnLoadTranslationError,
        }),
      })

      await vi.waitFor(() => {
        expect(mockOnLoadTranslationError).toHaveBeenCalledOnce()
        expect(mockOnLoadTranslationError).toHaveBeenCalledWith(expect.any(Error))
      })

      const error = mockOnLoadTranslationError.mock.calls[0]?.[0]
      expect(error).toBeDefined()
      expect((error as Error).message).toBe('Default locale load failed')

      expect(result.current.t('title')).toBe('')
    })

    it('should continue loading current locale even if default locale fails', async () => {
      expect.hasAssertions()
      const mockOnLoadTranslationError = vi.fn<OnLoadTranslationError>()
      const mockLoad = vi.fn<LoadTranslationsFn<Locales>>().mockImplementation(({ locale }) => {
        if (locale === 'en') {
          return Promise.reject(new Error('Default locale load failed'))
        }
        return Promise.resolve({ default: { title: 'French Title' } })
      })

      const { result } = renderHook(() => useTranslation<Locale, Locales>(['test'], mockLoad), {
        wrapper: wrapper({
          defaultLocale: 'fr',
          enableDefaultLocale: true,
          onLoadTranslationError: mockOnLoadTranslationError,
        }),
      })

      await vi.waitFor(() => {
        expect(mockOnLoadTranslationError).toHaveBeenCalledOnce()
        expect(result.current.t('title')).toBe('French Title')
      })
    })

    it('should not call onLoadTranslationError when translations load successfully', async () => {
      expect.hasAssertions()
      const mockOnLoadTranslationError = vi.fn<OnLoadTranslationError>()

      const { result } = renderHook(() => useTranslation<Locale, Locales>(['test']), {
        wrapper: wrapper({
          defaultLocale: 'en',
          onLoadTranslationError: mockOnLoadTranslationError,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.t('title')).toBe(en.title)
        expect(mockOnLoadTranslationError).not.toHaveBeenCalled()
      })
    })

    it('should call onLoadTranslationError for each namespace that fails', async () => {
      expect.hasAssertions()
      const mockOnLoadTranslationError = vi.fn<OnLoadTranslationError>()
      const mockLoad = vi.fn<LoadTranslationsFn<Locales>>().mockImplementation(({ namespace }) => {
        if (namespace === 'user') {
          return Promise.reject(new Error('User namespace failed'))
        }
        return Promise.resolve({ default: { name: 'Name' } })
      })

      const { result } = renderHook(() => useTranslation<NamespaceLocale, Locales>(['user', 'profile'], mockLoad), {
        wrapper: wrapper({
          defaultLocale: 'en',
          onLoadTranslationError: mockOnLoadTranslationError,
        }),
      })

      await vi.waitFor(() => {
        expect(mockOnLoadTranslationError).toHaveBeenCalled()
        expect(result.current.t('name')).toBe('Name')
      })
    })

    it('should handle errors when switching locale fails', async () => {
      expect.hasAssertions()
      const mockOnLoadTranslationError = vi.fn<OnLoadTranslationError>()
      const mockLoad = vi.fn<LoadTranslationsFn<Locales>>().mockImplementation(({ locale }) => {
        if (locale === 'fr') {
          return Promise.reject(new Error('French locale load failed'))
        }
        return Promise.resolve({ default: { title: 'English Title' } })
      })

      const { result } = renderHook(() => useTranslation<Locale, Locales>(['test'], mockLoad), {
        wrapper: wrapper({
          defaultLocale: 'en',
          onLoadTranslationError: mockOnLoadTranslationError,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.t('title')).toBe('English Title')
      })

      await act(async () => {
        await result.current.switchLocale('fr')
      })

      await vi.waitFor(() => {
        expect(mockOnLoadTranslationError).toHaveBeenCalled()
        expect(result.current.t('title')).toBe('')
      })
    })
  })
})
