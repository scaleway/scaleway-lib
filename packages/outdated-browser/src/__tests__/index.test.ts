/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'

const localStorageMock = (() => {
  let store: Record<string, unknown> = {}

  return {
    clear() {
      store = {}
    },
    getItem(key: string): unknown {
      return store[key] ?? null
    },
    removeItem(key: string) {
      delete store[key]
    },
    setItem(key: string, value: unknown) {
      store[key] = value?.toString()
    },
  }
})()

describe('@outdated-browser', () => {
  const originUA = global.navigator.userAgent
  let fakeUA: string | undefined

  beforeAll(() => {
    Object.defineProperty(global.navigator, 'userAgent', {
      get() {
        return fakeUA ?? originUA
      },
    })

    Object.defineProperty(window, 'sessionStorage', {
      value: localStorageMock,
    })
  })

  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
    sessionStorage.clear()
    // Clear dom for next test
    const htmlDocument = document.getElementsByTagName('html')[0]
    if (htmlDocument) {
      htmlDocument.innerHTML = ''
    }
    fakeUA = undefined
  })

  test('render nothing if SUPPORTED_BROWSER is nil', async () => {
    // @ts-expect-error global mock
    global.SUPPORTED_BROWSERS = ''

    return import('..').then(() => {
      expect(document.documentElement.innerHTML).toMatchSnapshot()
    })
  })

  test('render nothing if SUPPORTED_BROWSER is defined and match userAgent ', async () => {
    fakeUA = 'a'
    // @ts-expect-error global mock
    global.SUPPORTED_BROWSERS = 'a'

    return import('..').then(() => {
      expect(document.documentElement.innerHTML).toMatchSnapshot()
    })
  })

  test('render banner if SUPPORTED_BROWSER is defined and does not match userAgent', async () => {
    fakeUA = 'b'
    // @ts-expect-error global mock
    global.SUPPORTED_BROWSERS = 'a'

    return import('..').then(() => {
      expect(document.documentElement.innerHTML).toMatchSnapshot()
    })
  })

  test('render nothing if SUPPORTED_BROWSER is defined and does not match userAgent and user has already ignored banner', async () => {
    fakeUA = 'b'
    // @ts-expect-error global mock
    global.SUPPORTED_BROWSERS = 'a'
    sessionStorage.setItem('__outdated', 'true')

    return import('..').then(() => {
      expect(document.documentElement.innerHTML).toMatchSnapshot()
    })
  })

  test('render nothing if SUPPORTED_BROWSER is defined and does not match userAgent and user click on button', async () => {
    fakeUA = 'b'
    // @ts-expect-error global mock
    global.SUPPORTED_BROWSERS = 'a'
    // @ts-expect-error injected globally by module
    // oxlint-disable-next-line typescript-eslint/no-unsafe-call
    closeOutdated()

    return import('..').then(() => {
      expect(document.documentElement.innerHTML).toMatchSnapshot()
    })
  })
})
