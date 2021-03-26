import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import I18n, { useI18n } from '..'
import en from './locales/en'
// import fr from './locales/fr'

const LOCALE_ITEM_STORAGE = 'locales'

const wrapper = ({
  enableDefaultLocal = false,
  defaultLocale = 'en',
  defaultLocales = ['en', 'fr'],
  defaultTranslations = en,
  localeItemStorage = LOCALE_ITEM_STORAGE,
  // eslint-disable-next-line react/prop-types
} = {}) => ({ children }) => (
  <I18n
    enableDefaultLocal={enableDefaultLocal}
    defaultLocale={defaultLocale}
    defaultLocales={defaultLocales}
    defaultTranslations={defaultTranslations}
    localeItemStorage={localeItemStorage}
  >
    {children}
  </I18n>
)
const originalError = console.error
beforeEach(() => {
  localStorage.clear()

  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

describe('useI18n', () => {
  // it('should use default props', () => {
  //   const { result, rerender } = renderHook(() => useI18n(), {
  //     wrapper: wrapper({ defaultLocale: 'en' }),
  //   })
  //   let titleEn = ''
  //   act(() => {
  //     titleEn = result.current.t('title')
  //   })
  //   expect(titleEn).toEqual(en.title)
  // })

  it('should switch locale', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useI18n(), {
      wrapper: wrapper({
        defaultLocale: 'en',
        defaultLocales: ['en', 'fr', 'es'],
      }),
    })
    expect(result.current.currentLocale).toEqual('en')
    expect(localStorage.getItem(LOCALE_ITEM_STORAGE)).toBe(null)

    await act(async () => {
      result.current.switchLocale('fr')
      await waitForNextUpdate()
    })
    expect(result.current.currentLocale).toEqual('fr')
    expect(localStorage.getItem(LOCALE_ITEM_STORAGE)).toBe('fr')

    await act(async () => {
      result.current.switchLocale('es')
      await waitForNextUpdate()
    })
    expect(result.current.currentLocale).toEqual('es')
    expect(localStorage.getItem(LOCALE_ITEM_STORAGE)).toBe('es')

    act(() => {
      result.current.switchLocale('test')
    })
    expect(result.current.currentLocale).not.toEqual('test')
    expect(localStorage.getItem(LOCALE_ITEM_STORAGE)).not.toEqual('test')
  })

  it('should translate correctly', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: wrapper({
        defaultLocale: 'en',
        defaultLocales: ['en', 'fr'],
      }),
    })
    expect(result.current.t('title')).toEqual(en.title)
    expect(result.current.t('subtitle')).toEqual(en.subtitle)
    expect(result.current.t('plurals', { numPhotos: 0 })).toEqual(
      'You have no photos.',
    )
    expect(result.current.t('plurals', { numPhotos: 1 })).toEqual(
      'You have one photo.',
    )
    expect(result.current.t('plurals', { numPhotos: 2 })).toEqual(
      'You have 2 photos.',
    )
  })

  it('should use namespaceTranslation', () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: wrapper({
        defaultLocale: 'en',
      }),
    })
    const translate = result.current.namespaceTranslation('tests.test')
    expect(translate('namespaces')).toEqual('test namespace')

    // inception
    const translate1 = result.current.namespaceTranslation('tests')
    const translate2 = result.current.namespaceTranslation('test', translate1)
    expect(translate2('namespaces')).toEqual('test namespace')
  })

  it('should formatNumber', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useI18n(), {
      wrapper: wrapper({
        defaultLocale: 'en',
      }),
    })
    expect(
      result.current.formatNumber(2, { style: 'currency', currency: 'EUR' }),
    ).toEqual('€2.00')

    expect(
      result.current.formatNumber(2, { style: 'currency', currency: 'USD' }),
    ).toEqual('$2.00')

    await act(async () => {
      result.current.switchLocale('fr')
      await waitForNextUpdate()
    })

    // https://stackoverflow.com/questions/58769806/identical-strings-not-matching-in-jest
    // https://stackoverflow.com/questions/54242039/intl-numberformat-space-character-does-not-match

    expect(
      result.current.formatNumber(2, { style: 'currency', currency: 'EUR' }),
    ).toEqual('2,00\xa0€')
    expect(
      result.current.formatNumber(2, { style: 'currency', currency: 'USD' }),
    ).toEqual('2,00\xa0$US')
  })

  it.skip('should formatList', async () => {})
  it.skip('should datetime', async () => {})
  it.skip('should loadDateFnsLocale', async () => {})
  it.skip('should relativeTimeStrict', async () => {})
  it.skip('should relativeTime', async () => {})
  it.skip('should loadNamespace', async () => {})
  it.skip('should loadTranslations', async () => {})
  it.skip('should useTranslation', async () => {})
})
