import { describe, expect, test } from 'vitest'
import {
  absoluteLinuxPath,
  absolutePath,
  accessKeyRegex,
  advancedDomainName,
  alpha,
  alphaDashes,
  alphaLowercase,
  alphaUpperUnderscore,
  alphanum,
  alphanumDash,
  alphanumDashDots,
  alphanumDashDotsOrEmpty,
  alphanumDashDotsSpaces,
  alphanumDashLowercase,
  alphanumDashOrEmpty,
  alphanumDashSpaces,
  alphanumDashUnderscore,
  alphanumDashUnderscoreDollar,
  alphanumDashUnderscoreDotsSpaces,
  alphanumDashUnderscoreDotsSpacesParenthesis,
  alphanumDots,
  alphanumLowercase,
  ascii,
  backupKey,
  basicDomain,
  cron,
  dashedIpv4,
  digits,
  elevenDigitsCode,
  email,
  fourDigitsCode,
  hexadecimal,
  ip,
  ipCidr,
  ipv4,
  ipv4Cidr,
  ipv6,
  ipv6Cidr,
  macAddress,
  nineDigitsCode,
  password,
  pathSegment,
  phone,
  reverseDNS,
  s3BucketName,
  sgPortRange,
  sixDigitsCode,
  spaces,
  uppercaseBasicDomain,
  uppercaseBasicSubdomain,
  url,
} from '..'

const alphanumDashDotsText = 'testwithdashdots-.'
const alphanumDashUnderscoreDotsParenthesisText = 'testwithdashdots-_. ()'
const alphanumDashText = 'testwithdash-'
const uppercaseUnderscoreText = 'ASTT_GGF'
const asciiLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const nonAsciiLetters =
  'ÀÁÂÃÄÅàáâãäåÇçÈÉÊËèéêëÌÍÎÏìíîïÑñÒÓÔÕÖòóôõöÙÚÛÜùúûüÝýÿĀāĈĉĜĝĤĥĴĵŜŝŴŵŶŷāăąǎćĉčċđēĕėęǝğōŏőǒśŝşšūŭůűǔüźżž'
const asciiLowercase = 'abcdefghijklmnopqrstuvwxyz'
const asciiUppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const backupKeyTest = '123456789ABCEDFGHIJIKLMNOPQRSTUV'
const domain = 'another-example.com'
const subDomain = 'sub.another-example.com'
const dashStartDomain = '-sub.another-example.com'
const uppercaseDomain = 'SUB.another-example.com'
const longTldDomain = 'sub.another-example.verylongtld'
const cronTest = '0 0 0 */5 * 0 1-4'
const digitsTest = '0123456789'
const elevenDigitsCodeTest = '01234567890'
const emailTest = 'test@scaleway.com'
const fourDigitsTest = '2345'
const hexdigits = '0123456789abcdefABCDEF'
const octdigits = '01234567'
const phoneTest = '+33607080910'
const printable =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r\x0b\x0c'
const punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
const sixDigitsCodeTest = '123456'
const urls = [
  'http://console.scaleway.com',
  'https://www.scaleway.com',
  'https://www.scaleway.online',
  'http://www.scaleway.com:8080',
  'http://255.255.255.255',
  'http://www.example.com/product',
  'http://www.example.com/products?id=1&page=2',
  'http://www.example.com#up',
]
const whitespace = ' \t\n\r\x0b\x0c'
const macAddress1 = '1F:B5:FA:47:CD:C4'
const nineDigitsCodeTest = '012345678'
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
      [alphanumDashText, false],
      [alphanumDashDotsText, false],
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

  describe('alphaLowercase', () => {
    test.each([
      [alphanumDashText, false],
      [alphanumDashDotsText, false],
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
      expect(alphaLowercase.test(string)).toBe(expected)
    })
  })

  describe('alphanum', () => {
    test.each([
      [alphanumDashText, false],
      [alphanumDashDotsText, false],
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

  describe('alphaDashes', () => {
    test.each([
      [alphanumDashText, true],
      [alphanumDashDotsText, false],
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
      expect(alphaDashes.test(string)).toBe(expected)
    })
  })

  describe('alphanumDash', () => {
    test.each([
      [alphanumDashText, true],
      [alphanumDashDotsText, false],
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
      expect(alphanumDash.test(string)).toBe(expected)
    })
  })

  describe('alphanumDashDots', () => {
    test.each([
      [alphanumDashText, true],
      [alphanumDashDotsText, true],
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
      expect(alphanumDashDots.test(string)).toBe(expected)
    })
  })

  describe('alphanumDashDotsOrEmpty', () => {
    test.each([
      [alphanumDashText, true],
      [alphanumDashDotsText, true],
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
      expect(alphanumDashDotsOrEmpty.test(string)).toBe(expected)
    })
  })

  describe('alphanumDashDotsSpaces', () => {
    test.each([
      [alphanumDashText, true],
      [alphanumDashDotsText, true],
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
      expect(alphanumDashDotsSpaces.test(string)).toBe(expected)
    })
  })

  describe('alphanumDashUnderscoreDotsSpacesParenthesis', () => {
    test.each([
      [alphanumDashText, true],
      [alphanumDashDotsText, true],
      [alphanumDashUnderscoreDotsParenthesisText, true],
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
      expect(alphanumDashUnderscoreDotsSpacesParenthesis.test(string)).toBe(
        expected,
      )
    })
  })

  describe('alphanumDashUnderscore', () => {
    test.each([
      [alphanumDashText, true],
      [alphanumDashDotsText, false],
      [alphanumDashUnderscoreDotsParenthesisText, false],
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
      expect(alphanumDashUnderscore.test(string)).toBe(expected)
    })
  })

  describe('alphanumDashOrEmpty', () => {
    test.each([
      [alphanumDashText, true],
      [alphanumDashDotsText, false],
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
      expect(alphanumDashOrEmpty.test(string)).toBe(expected)
    })
  })

  describe('alphanumDashSpaces', () => {
    test.each([
      [alphanumDashText, true],
      [alphanumDashDotsText, false],
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
      expect(alphanumDashSpaces.test(string)).toBe(expected)
    })
  })

  describe('alphanumDots', () => {
    test.each([
      [alphanumDashText, false],
      [alphanumDashDotsText, false],
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
      expect(alphanumDots.test(string)).toBe(expected)
    })
  })
  describe('alphaUpperUnderscore', () => {
    test.each([
      [alphanumDashText, false],
      [uppercaseUnderscoreText, true],
      [alphanumDashDotsText, false],
      [asciiLetters, false],
      [asciiLowercase, false],
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
      expect(alphaUpperUnderscore.test(string)).toBe(expected)
    })
  })

  describe('alphanumLowercase', () => {
    test.each([
      [alphanumDashText, false],
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

  describe('alphanumDashLowercase', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, true],
      [alphanumDashText, true],
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
      expect(alphanumDashLowercase.test(string)).toBe(expected)
    })
  })

  describe('alphanumDashUnderscoreDotsSpaces', () => {
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
      expect(alphanumDashUnderscoreDotsSpaces.test(string)).toBe(expected)
    })
  })

  describe('alphanumDashUnderscoreDollar', () => {
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
      expect(alphanumDashUnderscoreDollar.test(string)).toBe(expected)
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
      [octdigits, true],
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
      ...(urls.map(urlString => [urlString, false]) as [string, boolean][]),
    ])('should match regex %s to be %s', (string, expected) => {
      expect(basicDomain.test(string)).toBe(expected)
    })
  })
  describe('uppercaseBasicDomain', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [backupKeyTest, false],
      [domain, true],
      [subDomain, true],
      [dashStartDomain, false],
      [uppercaseDomain, true],
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
      ...(urls.map(urlString => [urlString, false]) as [string, boolean][]),
    ])('should match regex %s to be %s', (string, expected) => {
      expect(uppercaseBasicDomain.test(string)).toBe(expected)
    })
  })

  describe('uppercaseBasicSubdomain', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [backupKeyTest, false],
      [domain, false],
      [subDomain, true],
      [dashStartDomain, false],
      [uppercaseDomain, true],
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
      ...(urls.map(urlString => [urlString, false]) as [string, boolean][]),
    ])('should match regex %s to be %s', (string, expected) => {
      expect(uppercaseBasicSubdomain.test(string)).toBe(expected)
    })
  })

  describe('advancedDomain', () => {
    test.each([
      [asciiLetters, false],
      [nonAsciiLetters, false],
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
      ...(urls.map(urlString => [urlString, false]) as [string, boolean][]),
    ])('should match regex %s to be %s', (string, expected) => {
      expect(advancedDomainName.test(string)).toBe(expected)
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

  describe('elevenDigitsCode', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [digitsTest, false],
      [emailTest, false],
      [octdigits, false],
      [elevenDigitsCodeTest, true],
      [hexdigits, false],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(elevenDigitsCode.test(string)).toBe(expected)
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

  describe('nineDigitsCode', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, false],
      [asciiUppercase, false],
      [digitsTest, false],
      [emailTest, false],
      [octdigits, false],
      [nineDigitsCodeTest, true],
      [hexdigits, false],
      [printable, false],
      [punctuation, false],
      [whitespace, false],
      [cronTest, false],
      [macAddress1, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(nineDigitsCode.test(string)).toBe(expected)
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
      [domain, false],
      [subDomain, false],
      ...(urls.map(urlString => [urlString, true]) as [string, boolean][]),
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
  describe('s3BucketName', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, true],
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
      [hexdigits, false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(s3BucketName.test(string)).toBe(expected)
    })
  })

  describe('ipv4', () => {
    test.each([
      ['192.168.1.1', true],
      ['127.0.0.1', true],
      ['0.0.0.0', true],
      ['255.255.255.255', true],
      ['1.2.3.4 hi', false],
      ['256.256.256.256', false],
      ['999.999.999.999', false],
      ['1.2.3', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ipv4.test(string)).toBe(expected)
    })
  })

  describe('ipv6', () => {
    test.each([
      ['1:2:3:4:5:6:7::', true],
      ['1:2:3:4:5:6::8', true],
      ['1:2::4:5:6:7:8', true],
      ['1::3:4:5:6:7:8', true],
      ['::2:3:4:5:6:7:8', true],
      ['::1.2.3.4', true],
      ['1:2::4:5:6:7:8 hi', false],
      ['192.168.1.1', false],
      ['127.0.0.1', false],
      ['typebot.io', false],
      ['256.256.256.256', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ipv6.test(string)).toBe(expected)
    })
  })

  describe('ip', () => {
    test.each([
      ['1:2:3:4:5:6:7::', true],
      ['1:2:3:4:5:6::8', true],
      ['::2:3:4:5:6:7:8', true],
      ['::1.2.3.4', true],
      ['192.168.1.1', true],
      ['127.0.0.1', true],
      ['0.0.0.0', true],
      ['255.255.255.255', true],
      ['256.256.256.256', false],
      ['1:2:3::5:6:7:900.2.3.4', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ip.test(string)).toBe(expected)
    })
  })

  describe('ipCidr', () => {
    test.each([
      ['1:2:3:4:5:6:7::/48', true],
      ['1:2:3:4:5:6::8/44', true],
      ['::2:3:4:5:6:7:8/64', true],
      ['::1.2.3.4/32', true],
      ['192.168.1.1/32', true],
      ['127.0.0.1/24', true],
      ['127.0.0.1/64', false],
      ['0.0.0.0/0', true],
      ['255.255.255.255/32', true],
      ['256.256.256.256/0', false],
      ['1:2:3::5:6:7:900.2.3.4/0', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ipCidr.test(string)).toBe(expected)
    })
  })

  describe('ipv4Cidr', () => {
    test.each([
      ['192.168.1.1/24', true],
      ['127.0.0.1/32', true],
      ['0.0.0.0/0', true],
      ['255.255.255.255/32', true],
      ['1.2.3.4/0 hi', false],
      ['256.256.256.256/32', false],
      ['999.999.999.999/999', false],
      ['1.2.3/0', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ipv4Cidr.test(string)).toBe(expected)
    })
  })

  describe('ipv6Cidr', () => {
    test.each([
      ['1:2:3:4:5:6:7::/48', true],
      ['1:2:3:4:5:6::8/48', true],
      ['1:2::4:5:6:7:8/36', true],
      ['1::3:4:5:6:7:8/32', true],
      ['::2:3:4:5:6:7:8/24', true],
      ['::1.2.3.4/64', true],
      ['1:2::4:5:6:7:8/48 hi', false],
      ['192.168.1.1/0', false],
      ['127.0.0.1/32', false],
      ['256.256.256.256/32', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ipv6Cidr.test(string)).toBe(expected)
    })
  })

  describe('reverseDNS', () => {
    test.each([
      ['fr.example.test.', true],
      ['fr.exemple.', true],
      ['wrong.fr', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(reverseDNS.test(string)).toBe(expected)
    })
  })

  describe('dashedIpv4', () => {
    test.each([
      ['192-168-1-0', true],
      ['192.168.1.0', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(dashedIpv4.test(string)).toBe(expected)
    })
  })

  describe('accessKeyRegex', () => {
    test.each([
      ['12301234567891234567', false],
      ['ABCABCDEFGHIJKLMNOPQ', false],
      ['SCWabcdefghijklmnopq', true],
      ['scw01234567891234567', true],
      ['SCW01234567891234567', true],
      ['SCWABCDEFGHIJKLMNOPQ', true],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(accessKeyRegex.test(string)).toBe(expected)
    })
  })

  describe('pathSegment', () => {
    test.each([
      ['/hello', false],
      ['hello', true],
      ['hello nop', false],
      ['hello?', false],
      ['hello-world', true],
      ['hello/world', false],
      ['/', false],
      ['a', true],
      ['1', true],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(pathSegment.test(string)).toBe(expected)
    })
  })

  describe('absolutePath', () => {
    test.each([
      ['/hello', true],
      ['/a', true],
      ['hello', false],
      ['/hello nop', true],
      ['/hello?', false],
      ['/hello-world', true],
      ['/hello/world', true],
      [
        `/hello/world
        ciao/test`,
        false,
      ],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(absolutePath.test(string)).toBe(expected)
    })
  })

  describe('sgPortRange', () => {
    test.each([
      // Valid single ports
      ['1', true],
      ['80', true],
      ['443', true],
      ['8080', true],
      ['65535', true],

      // Valid port ranges
      ['1-80', true],
      ['80-443', true],
      ['1000-2000', true],
      ['1-65535', true],
      ['8080-8090', true],

      // Edge cases for valid ports
      ['1-1', true],
      ['65535-65535', true],

      // Invalid: Port 0 not allowed => but regex was like that so product might accept it, keep it like that for now
      ['0', true],
      ['0-80', true],
      ['80-0', true],

      // Invalid: Ports above 65535
      ['65536', false],
      ['70000', false],
      ['1-70000', false],
      ['65536-65537', false],

      // Invalid formats
      ['', false],
      ['a', false],
      ['1a', false],
      ['a1', false],
      ['1,2', false],
      ['1:2', false],
      ['1 - 2', false],
      ['1~2', false],
      ['1-2-3', false],
      ['1-', false],
      ['-1', false],
      ['-', false],
      ['1--2', false],

      // Edge cases
      ['65534-65535', true],
      ['65535-65535', true],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(sgPortRange.test(string)).toBe(expected)
    })
  })

  describe('password', () => {
    test.each([
      ['password', true],
      ['Password123!', true],
      ['Password123!@#', true],
      ['password`', false],
      ['Password`123!@#', false],
      ['@Password123!@#', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(password.test(string)).toBe(expected)
    })
  })
})
