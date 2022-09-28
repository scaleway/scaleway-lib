/**
 * @jest-environment jsdom
 */

describe('@outdated-browser', () => {
  const originUA = global.navigator.userAgent
  let fakeUA: string | undefined

  beforeAll(() => {
    Object.defineProperty(global.navigator, 'userAgent', {
      get() {
        return fakeUA ?? originUA
      },
    })
  })

  afterEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
    fakeUA = undefined
  })

  test('render nothing if SUPPORTED_BROWSER is nil', () => {
    // @ts-expect-error global mock
    global.SUPPORTED_BROWSERS = ''

    // @ts-expect-error we know it's no a module
    return import('..').then(() => {
      expect(document.documentElement.innerHTML).toMatchSnapshot()
    })
  })

  test('render nothing if SUPPORTED_BROWSER is defined and match userAgent ', () => {
    fakeUA = 'a'
    // @ts-expect-error global mock
    global.SUPPORTED_BROWSERS = 'a'

    // @ts-expect-error we know it's no a module
    return import('..').then(() => {
      expect(document.documentElement.innerHTML).toMatchSnapshot()
    })
  })

  test('render banner if SUPPORTED_BROWSER is defined and does not mtch userAgen ', () => {
    fakeUA = 'b'
    // @ts-expect-error global mock
    global.SUPPORTED_BROWSERS = 'a'

    // @ts-expect-error we know it's no a module
    return import('..').then(() => {
      expect(document.documentElement.innerHTML).toMatchSnapshot()
    })
  })
})
