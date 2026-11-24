// oxlint-disable max-lines
import { act, renderHook } from '@testing-library/react'
import { MissingValueError } from 'intl-messageformat'
import type { ComponentProps, ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import I18n, { useI18n, useTranslation } from '..'
import type { LoadTranslationsFn } from '..'
import type { BaseLocale } from '../international-types'
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
type OnLoadTranslationError = Exclude<ComponentProps<typeof I18n>['onLoadTranslationError'], undefined>

const isDefaultLocalesSupported = (locale: string): locale is Locales => ListLocales.some(item => item === locale)

const load = async ({ locale, namespace }: { locale: string; namespace: string }) =>
  // oxlint-disable-next-line typescript/no-unsafe-return
  import(`./locales/namespaces/${locale}/${namespace}.json`)

const CustomComponent = ({ children }: { children: ReactNode }) => <p style={{ fontWeight: 'bold' }}>{children}</p>

const defaultOnTranslateError: OnTranslateError = () => undefined
const defaultOnLoadTranslationError: OnLoadTranslationError = () => undefined

const mockLoadRejectByLocale =
  (rejectLocale: string, error: Error, resolveValue: BaseLocale): LoadTranslationsFn<Locales> =>
  async ({ locale }) =>
    locale === rejectLocale ? Promise.reject(error) : Promise.resolve({ default: resolveValue })

const mockLoadRejectByNamespace =
  (rejectNamespace: string, error: Error, resolveValue: BaseLocale): LoadTranslationsFn<Locales> =>
  async ({ namespace }) =>
    namespace === rejectNamespace ? Promise.reject(error) : Promise.resolve({ default: resolveValue })

const mockLoadReturnEmptyForLocale =
  (emptyLocale: string, resolveValue: BaseLocale): LoadTranslationsFn<Locales> =>
  async ({ locale }) =>
    locale === emptyLocale ? Promise.resolve({ default: {} }) : Promise.resolve({ default: resolveValue })

const mockLoadByLocale =
  (enValue: BaseLocale, otherValue: BaseLocale): LoadTranslationsFn<Locales> =>
  async ({ locale }) =>
    locale === 'en' ? Promise.resolve({ default: enValue }) : Promise.resolve({ default: otherValue })

const mockStorage = (
  getItem: Storage['getItem'],
  setItem: Storage['setItem'],
  removeItem: Storage['removeItem'],
): Storage => ({
  clear: vi.fn<() => void>(),
  getItem,
  key: () => null,
  length: 0,
  removeItem,
  setItem,
})

const wrapper =
  ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    defaultLoad = async ({ locale }: { locale: string }) => import(`./locales/${locale}.ts`),
    defaultLocale = 'en',
    defaultTranslations = {},
    enableDebugKey = false,
    enableDefaultLocale = false,
    localeItemStorage = LOCALE_ITEM_STORAGE,
    isLocaleSupported = isDefaultLocalesSupported,
    rootElement,
    onTranslateError = defaultOnTranslateError,
    onLoadTranslationError = defaultOnLoadTranslationError,
  }: Partial<ComponentProps<typeof I18n>> = {}) =>
  ({ children }: { children: ReactNode }) => (
    <I18n
      defaultLoad={defaultLoad}
      defaultLocale={defaultLocale}
      defaultTranslations={defaultTranslations}
      enableDebugKey={enableDebugKey}
      enableDefaultLocale={enableDefaultLocale}
      isLocaleSupported={isLocaleSupported}
      localeItemStorage={localeItemStorage}
      onTranslateError={onTranslateError}
      onLoadTranslationError={onLoadTranslationError}
      rootElement={rootElement}
    >
      {children}
    </I18n>
  )

describe('i18n hook', () => {
  beforeEach(() => {
    vi.spyOn(globalThis.navigator, 'languages', 'get').mockReturnValue(['en-US', 'en'])
    vi.useFakeTimers()
  })

  afterEach(() => {
    localStorage.clear()
    vi.useRealTimers()
  })

  it('useTranslation should not be defined without I18nProvider', () => {
    expect.hasAssertions()
    const spy = vi.spyOn(console, 'error')
    spy.mockReturnValue(undefined)

    expect(() => renderHook(() => useTranslation(['test']))).toThrow(
      new Error('useTranslation must be used within a I18nProvider'),
    )
    spy.mockRestore()
  })

  it('useI18n should not be defined without I18nProvider', () => {
    expect.hasAssertions()
    const spy = vi.spyOn(console, 'error')
    spy.mockReturnValue(undefined)

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

    act(() => {
      result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.t('title')).toStrictEqual(fr.title)
    })

    act(() => {
      result.current.switchLocale('es')
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

    act(() => {
      result.current.switchLocale('fr')
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
    act(() => {
      result.current.switchLocale('fr')
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

  it('should support a namespace containing a comma', async () => {
    expect.hasAssertions()
    const mockLoad = vi.fn<LoadTranslationsFn<Locales>>().mockResolvedValue({
      default: { title: 'Comma Namespace Title' },
    })

    const { result } = renderHook(
      () => useTranslation<{ title: 'Comma Namespace Title' }, Locales>(['common,errors'], mockLoad),
      {
        wrapper: wrapper({ defaultLocale: 'en' }),
      },
    )

    await vi.waitFor(() => {
      expect(result.current.isLoaded).toBe(true)
    })
    expect(mockLoad).toHaveBeenCalledWith({ locale: 'en', namespace: 'common,errors' })
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
      const resourceText = 'My resource'
      expect(
        result.current.t('with.identifier', {
          identifier: <b key="1">{resourceText}</b>,
        }),
      ).toStrictEqual(['Are you sure you want to delete ', <b key="1">{resourceText}</b>, '?'])
      expect(
        result.current.t('with.identifier', {
          identifier: <CustomComponent key="1">{resourceText}</CustomComponent>,
        }),
      ).toStrictEqual([
        'Are you sure you want to delete ',
        <CustomComponent key="1">{resourceText}</CustomComponent>,
        '?',
      ])
    })
  })

  describe('getCurrentLocale', () => {
    it('should set current locale from localStorage', async () => {
      vi.spyOn(globalThis.navigator, 'languages', 'get').mockReturnValueOnce(['fr'])
      const mockGetItem = vi.fn<Storage['getItem']>().mockReturnValue('en')
      const mockSetItem = vi.fn<() => void>()
      const mockRemoveItem = vi.fn<() => void>()
      const localStorageMock = vi
        .spyOn(globalThis, 'localStorage', 'get')
        .mockReturnValue(mockStorage(mockGetItem, mockSetItem, mockRemoveItem))

      const { result } = renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'es',
          isLocaleSupported: isDefaultLocalesSupported,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.currentLocale).toBe('en')
        expect(mockGetItem).toHaveBeenCalledTimes(1)
        expect(mockGetItem).toHaveBeenCalledWith(LOCALE_ITEM_STORAGE)
      })
      localStorageMock.mockRestore()
    })

    it('should not set current locale from localStorage when this value is not supported', async () => {
      vi.spyOn(globalThis.navigator, 'languages', 'get').mockReturnValueOnce(['bz'])
      const mockGetItem = vi.fn<Storage['getItem']>().mockReturnValue('re')
      const mockSetItem = vi.fn<() => void>()
      const mockRemoveItem = vi.fn<() => void>()
      const localStorageMock = vi
        .spyOn(globalThis, 'localStorage', 'get')
        .mockReturnValue(mockStorage(mockGetItem, mockSetItem, mockRemoveItem))

      const { result } = renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'en',
          isLocaleSupported: isDefaultLocalesSupported,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.currentLocale).toBe('en')
        expect(mockGetItem).toHaveBeenCalledTimes(1)
        expect(mockGetItem).toHaveBeenCalledWith(LOCALE_ITEM_STORAGE)
      })
      localStorageMock.mockRestore()
    })

    it('should set current locale from navigator', async () => {
      vi.spyOn(globalThis.navigator, 'languages', 'get').mockReturnValueOnce(['fr'])
      const mockGetItem = vi.fn<Storage['getItem']>()
      const mockSetItem = vi.fn<() => void>()
      const mockRemoveItem = vi.fn<() => void>()
      const localStorageMock = vi
        .spyOn(globalThis, 'localStorage', 'get')
        .mockReturnValue(mockStorage(mockGetItem, mockSetItem, mockRemoveItem))

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
      vi.spyOn(globalThis.navigator, 'languages', 'get').mockReturnValueOnce([])
      const mockGetItem = vi.fn<Storage['getItem']>()
      const mockSetItem = vi.fn<() => void>()
      const mockRemoveItem = vi.fn<() => void>()
      const localStorageMock = vi
        .spyOn(globalThis, 'localStorage', 'get')
        .mockReturnValue(mockStorage(mockGetItem, mockSetItem, mockRemoveItem))

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

    it('should sanitize POSIX locale modifiers from navigator.languages', async () => {
      vi.spyOn(globalThis.navigator, 'languages', 'get').mockReturnValueOnce(['en-US@posix', 'en'])
      const mockGetItem = vi.fn<Storage['getItem']>()
      const mockSetItem = vi.fn<() => void>()
      const mockRemoveItem = vi.fn<() => void>()
      const localStorageMock = vi
        .spyOn(globalThis, 'localStorage', 'get')
        .mockReturnValue(mockStorage(mockGetItem, mockSetItem, mockRemoveItem))

      const { result } = renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'en',
          isLocaleSupported: isDefaultLocalesSupported,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.currentLocale).toBe('en')
        expect(mockSetItem).toHaveBeenCalledWith(LOCALE_ITEM_STORAGE, 'en')
        expect(mockSetItem).not.toHaveBeenCalledWith(LOCALE_ITEM_STORAGE, 'en-US@posix')
      })
      localStorageMock.mockRestore()
    })

    it('should sanitize POSIX locale modifiers from localStorage', async () => {
      vi.spyOn(globalThis.navigator, 'languages', 'get').mockReturnValueOnce(['en'])
      const mockGetItem = vi.fn<Storage['getItem']>().mockReturnValue('en-US@posix')
      const mockSetItem = vi.fn<() => void>()
      const mockRemoveItem = vi.fn<() => void>()
      const localStorageMock = vi
        .spyOn(globalThis, 'localStorage', 'get')
        .mockReturnValue(mockStorage(mockGetItem, mockSetItem, mockRemoveItem))

      const { result } = renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'en',
          isLocaleSupported: isDefaultLocalesSupported,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.currentLocale).toBe('en')
        expect(mockSetItem).toHaveBeenCalledWith(LOCALE_ITEM_STORAGE, 'en')
      })
      localStorageMock.mockRestore()
    })

    it('should not throw when formatting numbers with a sanitized POSIX locale', async () => {
      vi.spyOn(globalThis.navigator, 'languages', 'get').mockReturnValueOnce(['en-US@posix', 'en'])
      const mockGetItem = vi.fn<Storage['getItem']>()
      const mockSetItem = vi.fn<() => void>()
      const mockRemoveItem = vi.fn<() => void>()
      const localStorageMock = vi
        .spyOn(globalThis, 'localStorage', 'get')
        .mockReturnValue(mockStorage(mockGetItem, mockSetItem, mockRemoveItem))

      const { result } = renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'en',
          isLocaleSupported: isDefaultLocalesSupported,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.currentLocale).toBe('en')
      })
      expect(() => result.current.formatNumber(1000)).not.toThrow()
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

    act(() => {
      result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.currentLocale).toBe('fr')
    })
    expect(localStorage.getItem(LOCALE_ITEM_STORAGE)).toBe('fr')

    act(() => {
      result.current.switchLocale('es')
    })

    await vi.waitFor(() => {
      expect(result.current.currentLocale).toBe('es')
    })
    expect(localStorage.getItem(LOCALE_ITEM_STORAGE)).toBe('es')

    act(() => {
      // we test even if an incorrect typescript value is being passed to the function

      // @ts-expect-error expected error
      result.current.switchLocale('test')
    })

    await vi.waitFor(() => {
      expect(result.current.currentLocale).toBe('es')
    })
    expect(localStorage.getItem(LOCALE_ITEM_STORAGE)).toBe('es')
  })

  describe('lang attribute', () => {
    it('should set lang attribute on documentElement from navigator locale', async () => {
      document.documentElement.lang = ''
      vi.spyOn(globalThis.navigator, 'languages', 'get').mockReturnValueOnce(['fr'])

      renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'es',
          isLocaleSupported: isDefaultLocalesSupported,
        }),
      })

      await vi.waitFor(() => {
        expect(document.documentElement.lang).toBe('fr')
      })
    })

    it('should set lang attribute on documentElement from defaultLocale', async () => {
      document.documentElement.lang = ''
      vi.spyOn(globalThis.navigator, 'languages', 'get').mockReturnValueOnce([])

      renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'es',
          isLocaleSupported: isDefaultLocalesSupported,
        }),
      })

      await vi.waitFor(() => {
        expect(document.documentElement.lang).toBe('es')
      })
    })

    it('should set lang attribute on provided rootElement', async () => {
      const rootElement = document.createElement('html')

      renderHook(() => useI18n(), {
        wrapper: wrapper({
          defaultLocale: 'en',
          isLocaleSupported: isDefaultLocalesSupported,
          rootElement,
        }),
      })

      await vi.waitFor(() => {
        expect(rootElement.getAttribute('lang')).toBe('en')
      })
    })

    it('should update lang attribute on provided rootElement when switching locale', async () => {
      const rootElement = document.createElement('html')

      const { result } = renderHook(() => useI18n<Locale, Locales>(), {
        wrapper: wrapper({
          defaultLocale: 'en',
          isLocaleSupported: isDefaultLocalesSupported,
          rootElement,
        }),
      })

      await vi.waitFor(() => {
        expect(rootElement.getAttribute('lang')).toBe('en')
      })

      act(() => {
        result.current.switchLocale('fr')
      })

      await vi.waitFor(() => {
        expect(rootElement.getAttribute('lang')).toBe('fr')
      })
    })
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
    const mockOnTranslateError = vi.fn<NonNullable<OnTranslateError>>()

    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
        defaultTranslations: { en, fr },
        isLocaleSupported: isDefaultLocalesSupported,
        onTranslateError: mockOnTranslateError,
      }),
    })

    act(() => {
      result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.currentLocale).toBe('fr')
    })

    const newVariable = 'newVariable'
    expect(result.current.t('translate.error', { newVariable: 'newVariable' })).toBe(
      `On translate sync issue with variable between locales ${newVariable}`,
    )

    expect(mockOnTranslateError).toHaveBeenCalledTimes(1)

    const onTranslateErrorCall = mockOnTranslateError.mock.calls[0]?.[0]
    expect(onTranslateErrorCall?.currentLocale).toBe('fr')
    expect(onTranslateErrorCall?.defaultLocale).toBe('en')
    expect(onTranslateErrorCall?.key).toBe('translate.error')
    expect(onTranslateErrorCall?.value).toBe(
      'onTranslateError fonction sera appelé car il manque une variable en français {oldFrenchVariable}',
    )
    expect(onTranslateErrorCall?.error).toBeInstanceOf(MissingValueError)

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

    act(() => {
      result.current.switchLocale('fr')
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

    act(() => {
      result.current.switchLocale('fr')
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

    act(() => {
      result.current.switchLocale('fr')
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

  it('should relativeTime', () => {
    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
      }),
    })
    vi.setSystemTime(new Date('4/13/2021'))
    const date = new Date('September 13, 2000 15:15:00')

    expect(result.current.relativeTime(date)).toBe('21 years ago')
    expect(result.current.relativeTime(new Date('4/13/2021').getTime() - 60_000)).toBe('1 minute ago')
    expect(result.current.relativeTime(new Date('4/15/2021'))).toBe('in 2 days')
    expect(result.current.relativeTime(new Date('4/13/2021').getTime() - 90_000)).toBe('2 minutes ago')
    expect(result.current.relativeTime(new Date('4/13/2021').getTime() + 90_000)).toBe('in 2 minutes')
    expect(result.current.relativeTime(date, { noSuffix: true })).toBe('21 years')
    expect(result.current.relativeTime(date, { noSuffix: true, style: 'narrow' })).toBe('21y')
    expect(result.current.relativeTime(new Date('4/15/2021'), { noSuffix: true })).toBe('2 days')

    act(() => {
      result.current.switchLocale('fr')
    })

    expect(result.current.relativeTime(date)).toBe('il y a 21 ans')
    expect(result.current.relativeTime(date, { noSuffix: true })).toBe('21 ans')
  })

  it('should formatDuration', () => {
    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
      }),
    })
    vi.setSystemTime(new Date('4/13/2021'))

    expect(result.current.formatDuration(3600)).toBe('1 hour')
    expect(result.current.formatDuration(13_250)).toBe('3 hours, 40 minutes, 50 seconds')
    expect(result.current.formatDuration(45 * 86_400)).toBe('45 days')
    expect(result.current.formatDuration(13_250, { style: 'narrow' })).toBe('3h 40m 50s')
    expect(result.current.formatDuration(13_250, 'clock')).toBe('03:40:50')
    expect(result.current.formatDuration(0)).toBe('')
    expect(result.current.formatDuration(0, 'clock')).toBe('00:00:00')

    expect(result.current.formatDuration(0.03)).toBe('')
    expect(result.current.formatDuration(0.03, 'clock')).toBe('00:00:00')
    expect(result.current.formatDuration(0.03, 'clock-milliseconds')).toBe('00:00:00:030')

    expect(result.current.formatDuration(Number.NaN)).toBe('')
    expect(result.current.formatDuration(Number.NaN, 'clock')).toBe('00:00:00')
    expect(result.current.formatDuration(Number.NaN, 'clock-milliseconds')).toBe('00:00:00:000')
    expect(result.current.formatDuration(Number.POSITIVE_INFINITY)).toBe('')

    act(() => {
      result.current.switchLocale('fr')
    })

    expect(result.current.formatDuration(13_250)).toBe('3\u00A0heures, 40 minutes et 50\u00A0secondes')
    expect(result.current.formatDuration(13_250, { style: 'narrow' })).toBe('3h 40min 50s')
    expect(result.current.formatDuration(13_250, 'clock')).toBe('03:40:50')
    expect(result.current.formatDuration(0)).toBe('')
    expect(result.current.formatDuration(0, 'clock')).toBe('00:00:00')
  })

  it('should relativeTimeStrict', () => {
    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
      }),
    })
    vi.setSystemTime(new Date('4/13/2021'))
    const date = new Date('September 13, 2011 15:15:00')

    expect(result.current.relativeTimeStrict(date)).toBe('3,499 days ago')
    expect(result.current.relativeTimeStrict(date, { noSuffix: true })).toBe('3,499 days')
    expect(result.current.relativeTimeStrict(new Date('4/11/2021 12:00'))).toBe('2 days ago')
    expect(result.current.relativeTimeStrict(new Date('4/12/2020 12:00'))).toBe('366 days ago')
    expect(() => result.current.relativeTimeStrict(date, { unit: 'quarter', noSuffix: true })).toThrow(
      "noSuffix is not supported with the 'quarter' unit",
    )
    act(() => {
      result.current.switchLocale('fr')
    })

    expect(result.current.relativeTimeStrict(date)).toBe('il y a 3\u202F499 jours')
    expect(result.current.relativeTimeStrict(date, { noSuffix: true })).toBe('3\u202F499\u00A0jours')
  })

  it('should formatUnit', async () => {
    const { result } = renderHook(() => useI18n<Locale, Locales>(), {
      wrapper: wrapper({
        defaultLocale: 'en',
      }),
    })

    expect(result.current.formatUnit(12, { short: false, unit: 'byte' })).toBe('12 bytes')
    act(() => {
      result.current.switchLocale('fr')
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
    act(() => {
      result.current.switchLocale('fr')
    })

    await vi.waitFor(() => {
      expect(result.current.formatDate(new Date(2020, 1, 13, 16, 28), 'numericHour')).toBe('2020-02-13 16:28')
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
        expect(mockOnLoadTranslationError).toHaveBeenCalledTimes(1)
        expect(mockOnLoadTranslationError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Network error' }))
      })

      expect(result.current.t('title')).toBe('')
    })

    it('should call onLoadTranslationError when loading translation fails for default locale', async () => {
      expect.hasAssertions()
      const mockOnLoadTranslationError = vi.fn<OnLoadTranslationError>()
      const mockLoad = vi
        .fn<LoadTranslationsFn<Locales>>()
        .mockImplementation(
          mockLoadRejectByLocale('en', new Error('Default locale load failed'), { title: 'Titre en français' }),
        )

      const { result } = renderHook(() => useTranslation<Locale, Locales>(['test'], mockLoad), {
        wrapper: wrapper({
          defaultLocale: 'en',
          enableDefaultLocale: true,
          onLoadTranslationError: mockOnLoadTranslationError,
        }),
      })

      await vi.waitFor(() => {
        expect(mockOnLoadTranslationError).toHaveBeenCalledTimes(1)
        expect(mockOnLoadTranslationError).toHaveBeenCalledWith(
          expect.objectContaining({ message: 'Default locale load failed' }),
        )
      })

      expect(result.current.t('title')).toBe('')
    })

    it('should continue loading current locale even if default locale fails', async () => {
      expect.hasAssertions()
      const mockOnLoadTranslationError = vi.fn<OnLoadTranslationError>()
      const mockLoad = vi
        .fn<LoadTranslationsFn<Locales>>()
        .mockImplementation(
          mockLoadRejectByLocale('en', new Error('Default locale load failed'), { title: 'French Title' }),
        )

      const { result } = renderHook(() => useTranslation<Locale, Locales>(['test'], mockLoad), {
        wrapper: wrapper({
          defaultLocale: 'fr',
          enableDefaultLocale: true,
          onLoadTranslationError: mockOnLoadTranslationError,
        }),
      })

      await vi.waitFor(() => {
        expect(mockOnLoadTranslationError).toHaveBeenCalledTimes(1)
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
        expect(mockOnLoadTranslationError).not.toHaveBeenCalledTimes(1)
      })
    })

    it('should call onLoadTranslationError for each namespace that fails', async () => {
      expect.hasAssertions()
      const mockOnLoadTranslationError = vi.fn<OnLoadTranslationError>()
      const mockLoad = vi
        .fn<LoadTranslationsFn<Locales>>()
        .mockImplementation(mockLoadRejectByNamespace('user', new Error('User namespace failed'), { name: 'Name' }))

      const { result } = renderHook(() => useTranslation<NamespaceLocale, Locales>(['user', 'profile'], mockLoad), {
        wrapper: wrapper({
          defaultLocale: 'en',
          onLoadTranslationError: mockOnLoadTranslationError,
        }),
      })

      await vi.waitFor(() => {
        expect(mockOnLoadTranslationError).toHaveBeenCalledTimes(1)
        expect(result.current.t('name')).toBe('Name')
      })
    })

    it('should handle errors when switching locale fails', async () => {
      expect.hasAssertions()
      const mockOnLoadTranslationError = vi.fn<OnLoadTranslationError>()
      const mockLoad = vi
        .fn<LoadTranslationsFn<Locales>>()
        .mockImplementation(
          mockLoadRejectByLocale('fr', new Error('French locale load failed'), { title: 'English Title' }),
        )

      const { result } = renderHook(() => useTranslation<Locale, Locales>(['test'], mockLoad), {
        wrapper: wrapper({
          defaultLocale: 'en',
          onLoadTranslationError: mockOnLoadTranslationError,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.t('title')).toBe('English Title')
      })

      act(() => {
        result.current.switchLocale('fr')
      })

      await vi.waitFor(() => {
        expect(mockOnLoadTranslationError).toHaveBeenCalledTimes(1)
        expect(result.current.t('title')).toBe('')
      })
    })
  })

  describe('loadTranslations result key', () => {
    it('should use defaultLocale variable value as key, not literal "defaultLocale" string', async () => {
      expect.hasAssertions()
      const mockLoad = vi
        .fn<LoadTranslationsFn<Locales>>()
        .mockImplementation(mockLoadByLocale({ title: 'English Title' }, { title: 'French Title' }))

      const { result } = renderHook(() => useTranslation<Locale, Locales>(['test'], mockLoad), {
        wrapper: wrapper({
          defaultLocale: 'en',
          enableDefaultLocale: true,
        }),
      })

      await vi.waitFor(() => {
        const { translations } = result.current

        expect(translations['en']).toBeDefined()
        expect(translations['en']?.['title']).toBe('English Title')
        expect(translations['defaultLocale']).toBeUndefined()
      })
    })

    it('should not crash when load returns empty translations for default locale', async () => {
      expect.hasAssertions()
      const mockOnLoadTranslationError = vi.fn<OnLoadTranslationError>()
      const mockLoad = vi
        .fn<LoadTranslationsFn<Locales>>()
        .mockImplementation(mockLoadReturnEmptyForLocale('fr', { title: 'English Title' }))

      const { result } = renderHook(() => useTranslation<Locale, Locales>(['test'], mockLoad), {
        wrapper: wrapper({
          defaultLocale: 'fr',
          enableDefaultLocale: true,
          onLoadTranslationError: mockOnLoadTranslationError,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.t('title')).toBe('English Title')
      })
    })

    it('should not crash when load returns empty translations for current locale', async () => {
      expect.hasAssertions()
      const mockOnLoadTranslationError = vi.fn<OnLoadTranslationError>()
      const mockLoad = vi
        .fn<LoadTranslationsFn<Locales>>()
        .mockImplementation(mockLoadReturnEmptyForLocale('en', { title: 'English Title' }))

      const { result } = renderHook(() => useTranslation<Locale, Locales>(['test'], mockLoad), {
        wrapper: wrapper({
          defaultLocale: 'fr',
          enableDefaultLocale: true,
          onLoadTranslationError: mockOnLoadTranslationError,
        }),
      })

      await vi.waitFor(() => {
        expect(result.current.t('title')).toBe('English Title')
      })
    })
  })
})
