import { afterEach, beforeAll, describe, expect, jest, test } from '@jest/globals'

/**
 * @jest-environment jsdom
 */

const localStorageMock = (() => {
  let store: Record<string, unknown> = {}

  return {
    getItem(key: string): unknown {
      return store[key] || null
    },
    setItem(key: string, value: unknown) {
      store[key] = value?.toString()
    },
    removeItem(key: string) {
      delete store[key]
    },
    clear() {
      store = {}
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
    jest.resetModules()
    jest.restoreAllMocks()
    sessionStorage.clear()
    // Clear dom for next test
    const htmlDocument = document.getElementsByTagName('html')[0]
    if (htmlDocument) {
      htmlDocument.innerHTML = ''
    }
    fakeUA = undefined
  })

  test('render nothing if SUPPORTED_BROWSER is nil', () => {
    // @ts-expect-error global mock
    global.SUPPORTED_BROWSERS = ''

    return import('..').then(() => {
      expect(document.documentElement.innerHTML).toMatchSnapshot()
    })
  })

  test('render nothing if SUPPORTED_BROWSER is defined and match userAgent ', () => {
    fakeUA = 'a'
    // @ts-expect-error global mock
    global.SUPPORTED_BROWSERS = 'a'

    return import('..').then(() => {
      expect(document.documentElement.innerHTML).toMatchSnapshot()
    })
  })

  test('render banner if SUPPORTED_BROWSER is defined and does not match userAgent', () => {
    fakeUA = 'b'
    // @ts-expect-error global mock
    global.SUPPORTED_BROWSERS = 'a'

    return import('..').then(() => {
      expect(document.documentElement.innerHTML).toMatchSnapshot()
    })
  })

  test('render nothing if SUPPORTED_BROWSER is defined and does not match userAgent and user has already ignored banner', () => {
    fakeUA = 'b'
    // @ts-expect-error global mock
    global.SUPPORTED_BROWSERS = 'a'
    sessionStorage.setItem('__outdated', 'true')

    return import('..').then(() => {
      expect(document.documentElement.innerHTML).toMatchSnapshot()
    })
  })

  test('render nothing if SUPPORTED_BROWSER is defined and does not match userAgent and user click on button', () => {
    fakeUA = 'b'
    // @ts-expect-error global mock
    global.SUPPORTED_BROWSERS = 'a'
    // @ts-expect-error injected globally by module
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    closeOutdated()

    return import('..').then(() => {
      expect(document.documentElement.innerHTML).toMatchSnapshot()
    })
  })
})
