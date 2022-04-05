import {
  absoluteLinuxPath,
  alpha,
  alphaLower,
  alphanum,
  alphanumLowercase,
  alphanumSpacesDotsUnderscoreDash,
  alphanumUnderscoreDash,
  alphanumUnderscoreDollarDash,
  alphanumdash,
  alphanumdashdots,
  alphanumdashdotsorempty,
  alphanumdashdotsspaces,
  alphanumdashorempty,
  alphanumdashspaces,
  alphanumdots,
  ascii,
  backupKey,
  basicDomain,
  cron,
  digits,
  email,
  fourDigitsCode,
  hexadecimal,
  macAddress,
  phone,
  sixDigitsCode,
  spaces,
  url,
} from '..'

const alphanumdashdotsText = 'testwithdashdots-.'
const alphanumdashText = 'testwithdash-'
const asciiLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const asciiLowercase = 'abcdefghijklmnopqrstuvwxyz'
const asciiUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const backupKeyTest = '123456789ABCEDFGHIJIKLMNOPQRSTUV'
const domain = 'another-example.com'
const subDomain = 'sub.another-example.com'
const longTldDomain = 'sub.another-example.verylongtld'
const cronTest = '0/15*-'
const digitsTest = '0123456789'
const emailTest = 'test@scaleway.com'
const fourDigitsTest = '2345'
const hexdigits = '0123456789abcdefABCDEF'
const octdigits = '01234567'
const phoneTest = '+33607080910'
const printable =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r\x0b\x0c'
const punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
const sixDigitsCodeTest = '123456'
const url1 = 'http://console.scaleway.com'
const url2 = 'https://www.scaleway.com'
const whitespace = ' \t\n\r\x0b\x0c'
const macAddress1 = '1F:B5:FA:47:CD:C4'
const linuxPaths = {
  BAD: [
    '/var/test@',
    '/var/test/',
    '/var/test@',
    '/var//test',
    '//',
    '/var/test-',
  ],
  GOOD: ['/var', '/var/test', '/var/test_', '/var_/test', '/'],
}

describe('@regex', () => {
  describe('alpha', () => {
    test.each([
      [alphanumdashText, false],
      [alphanumdashdotsText, false],
      [asciiLetters, true],
      [asciiLowercase, true],
      [asciiUppercase, true],
      [digitsTest, false],
      [emailTest, false],
      [octdigits, false],
      [hexdigits, false],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alpha.test(string)).toBe(expected)
    })
  })

  describe('alphaLower', () => {
    test.each([
      [alphanumdashText, false],
      [alphanumdashdotsText, false],
      [asciiLetters, false],
      [asciiLowercase, true],
      [asciiUppercase, false],
      [digitsTest, false],
      [emailTest, false],
      [octdigits, false],
      [hexdigits, false],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphaLower.test(string)).toBe(expected)
    })
  })

  describe('alphanum', () => {
    test.each([
      [alphanumdashText, false],
      [alphanumdashdotsText, false],
      [asciiLetters, true],
      [asciiLowercase, true],
      [asciiUppercase, true],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, true],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanum.test(string)).toBe(expected)
    })
  })

  describe('alphanumdash', () => {
    test.each([
      [alphanumdashText, true],
      [alphanumdashdotsText, false],
      [asciiLetters, true],
      [asciiLowercase, true],
      [asciiUppercase, true],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, true],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumdash.test(string)).toBe(expected)
    })
  })

  describe('alphanumdashdots', () => {
    test.each([
      [alphanumdashText, true],
      [alphanumdashdotsText, true],
      [asciiLetters, true],
      [asciiLowercase, true],
      [asciiUppercase, true],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, true],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumdashdots.test(string)).toBe(expected)
    })
  })

  describe('alphanumdashdotsorempty', () => {
    test.each([
      [alphanumdashText, true],
      [alphanumdashdotsText, true],
      [asciiLetters, true],
      [asciiLowercase, true],
      [asciiUppercase, true],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, true],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumdashdotsorempty.test(string)).toBe(expected)
    })
  })

  describe('alphanumdashdotsspaces', () => {
    test.each([
      [alphanumdashText, true],
      [alphanumdashdotsText, true],
      [asciiLetters, true],
      [asciiLowercase, true],
      [asciiUppercase, true],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, true],
      [printable, false],
      [punctuation, false],
      [whitespace, true],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumdashdotsspaces.test(string)).toBe(expected)
    })
  })

  describe('alphanumdashorempty', () => {
    test.each([
      [alphanumdashText, true],
      [alphanumdashdotsText, false],
      [asciiLetters, true],
      [asciiLowercase, true],
      [asciiUppercase, true],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, true],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumdashorempty.test(string)).toBe(expected)
    })
  })

  describe('alphanumdashspaces', () => {
    test.each([
      [alphanumdashText, true],
      [alphanumdashdotsText, false],
      [asciiLetters, true],
      [asciiLowercase, true],
      [asciiUppercase, true],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, true],
      [printable, false],
      [punctuation, false],
      [whitespace, true],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumdashspaces.test(string)).toBe(expected)
    })
  })

  describe('alphanumdots', () => {
    test.each([
      [alphanumdashText, false],
      [alphanumdashdotsText, false],
      [asciiLetters, true],
      [asciiLowercase, true],
      [asciiUppercase, true],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, true],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumdots.test(string)).toBe(expected)
    })
  })

  describe('alphanumLowercase', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, true],
      [asciiUppercase, false],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, false],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumLowercase.test(string)).toBe(expected)
    })
  })

  describe('alphanumSpacesDotsUnderscoreDash', () => {
    test.each([
      [asciiLetters, true],
      [asciiLowercase, true],
      [asciiUppercase, true],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, true],
      [printable, false],
      [punctuation, false],
      [whitespace, true],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumSpacesDotsUnderscoreDash.test(string)).toBe(expected)
    })
  })

  describe('alphanumUnderscoreDash', () => {
    test.each([
      [asciiLetters, true],
      [asciiLowercase, true],
      [asciiUppercase, true],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, true],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumUnderscoreDash.test(string)).toBe(expected)
    })
  })

  describe('alphanumUnderscoreDollarDash', () => {
    test.each([
      [asciiLetters, true],
      [asciiLowercase, true],
      [asciiUppercase, true],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, true],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumUnderscoreDollarDash.test(string)).toBe(expected)
    })
  })

  describe('absoluteLinuxPath', () => {
    test.each([
      ...linuxPaths.GOOD.map(
        (testStr: string) => [testStr, true] as [string, boolean],
      ),
      ...linuxPaths.BAD.map(
        (testStr: string) => [testStr, false] as [string, boolean],
      ),
    ])('should match regex %s to be %s', (string, expected) => {
      expect(absoluteLinuxPath.test(string)).toBe(expected)
    })
  })

  describe('ascii', () => {
    test.each([
      [asciiLetters, true],
      [asciiLowercase, true],
      [asciiUppercase, true],
      [digitsTest, true],
      [emailTest, true],
      [octdigits, true],
      [hexdigits, true],
      [printable, true],
      [punctuation, true],
      [whitespace, true],
      [cronTest, true],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ascii.test(string)).toBe(expected)
    })
  })

  describe('backupKey', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [backupKeyTest, true],
      [digitsTest, false],
      [emailTest, false],
      [octdigits, false],
      [hexdigits, false],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(backupKey.test(string)).toBe(expected)
    })
  })
  describe('basicDomain', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [backupKeyTest, false],
      [domain, true],
      [subDomain, true],
      [longTldDomain, true],
      [digitsTest, false],
      [emailTest, false],
      [octdigits, false],
      [hexdigits, false],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
      [url1, false],
      [url2, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(basicDomain.test(string)).toBe(expected)
    })
  })

  describe('cron', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, false],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, true],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(cron.test(string)).toBe(expected)
    })
  })

  describe('digits', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [hexdigits, false],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(digits.test(string)).toBe(expected)
    })
  })

  describe('email', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [digitsTest, false],
      [emailTest, true],
      [octdigits, false],
      [hexdigits, false],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(email.test(string)).toBe(expected)
    })
  })

  describe('fourDigitsCode', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [digitsTest, false],
      [emailTest, false],
      [octdigits, false],
      [fourDigitsTest, true],
      [hexdigits, false],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(fourDigitsCode.test(string)).toBe(expected)
    })
  })

  describe('macAddress', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [digitsTest, false],
      [emailTest, false],
      [octdigits, false],
      [fourDigitsTest, false],
      [hexdigits, false],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, true],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(macAddress.test(string)).toBe(expected)
    })
  })

  describe('phone', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [digitsTest, false],
      [emailTest, false],
      [octdigits, false],
      [fourDigitsTest, false],
      [hexdigits, false],
      [printable, false],
      [phoneTest, true],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(phone.test(string)).toBe(expected)
    })
  })

  describe('spaces', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [digitsTest, false],
      [emailTest, false],
      [octdigits, false],
      [fourDigitsTest, false],
      [hexdigits, false],
      [printable, false],
      [phoneTest, false],
      [punctuation, false],
      [whitespace, true],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(spaces.test(string)).toBe(expected)
    })
  })

  describe('sixDigitsCode', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [digitsTest, false],
      [emailTest, false],
      [octdigits, false],
      [fourDigitsTest, false],
      [hexdigits, false],
      [printable, false],
      [phoneTest, false],
      [sixDigitsCodeTest, true],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(sixDigitsCode.test(string)).toBe(expected)
    })
  })

  describe('url', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [digitsTest, false],
      [emailTest, false],
      [octdigits, false],
      [fourDigitsTest, false],
      [hexdigits, false],
      [printable, false],
      [phoneTest, false],
      [sixDigitsCodeTest, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
      [url1, true],
      [url2, true],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(url.test(string)).toBe(expected)
    })
  })

  describe('hexadecimal', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [digitsTest, true],
      [emailTest, false],
      [octdigits, true],
      [fourDigitsTest, true],
      [printable, false],
      [phoneTest, false],
      [sixDigitsCodeTest, true],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [hexdigits, true],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(hexadecimal.test(string)).toBe(expected)
    })
  })
})
