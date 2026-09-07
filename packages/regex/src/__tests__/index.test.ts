// oxlint-disable eslint/max-statements max-lines

import { describe, expect, it } from 'vitest'
import {
  absoluteLinuxPath,
  absolutePath,
  accessKeyRegex,
  advancedDomainName,
  alpha,
  alphaDashes,
  alphaLowercase,
  alphanum,
  alphanumDash,
  alphanumDashDots,
  alphanumDashDotsOrEmpty,
  alphanumDashDotsSpaces,
  alphanumDashLowercase,
  alphanumDashOrEmpty,
  alphanumDashSegment,
  alphanumDashSpaces,
  alphanumDashUnderscore,
  alphanumDashUnderscoreDollar,
  alphanumDashUnderscoreDotsSpaces,
  alphanumDashUnderscoreDotsSpacesParenthesis,
  alphanumDots,
  alphanumLowercase,
  alphaUpperUnderscore,
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
  kafkaUsernameRegex,
  macAddress,
  nineDigitsCode,
  organizationAlias,
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
  urlWithoutProtocol,
  uuid,
  webhostingUsernameEmailRegex,
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
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r\u000B\u000C'
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
const whitespace = ' \t\n\r\u000B\u000C'
const macAddress1 = '1F:B5:FA:47:CD:C4'
const nineDigitsCodeTest = '012345678'
const linuxPaths = {
  BAD: ['/var/test@', '/var/test/', '/var/test@', '/var//test', '//', '/var/test-'],
  GOOD: ['/var', '/var/test', '/var/test_', '/var_/test', '/'],
}
const uuidTest = '550e8400-e29b-41d4-a716-446655440000'

describe('@regex', () => {
  describe('regex alpha', () => {
    it.each([
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
      ['', true],
      ['a', true],
      ['A', true],
      ['aBcD', true],
      ['1', false],
      ['a1', false],
      ['a-b', false],
      ['a_b', false],
      [' ', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alpha.test(string)).toBe(expected)
    })
  })

  describe('regex alphaLowercase', () => {
    it.each([
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
      ['a', true],
      ['abc', true],
      ['', false],
      ['A', false],
      ['1', false],
      ['a1', false],
      ['-', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphaLowercase.test(string)).toBe(expected)
    })
  })

  describe('regex alphanum', () => {
    it.each([
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
      ['', true],
      ['a1B', true],
      ['0', true],
      ['-', false],
      ['_', false],
      [' ', false],
      ['a.b', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanum.test(string)).toBe(expected)
    })
  })

  describe('regex alphaDashes', () => {
    it.each([
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
      ['', true],
      ['a-', true],
      ['-a', true],
      ['--', true],
      ['a-b', true],
      ['1', false],
      ['a1', false],
      ['_', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphaDashes.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumDash', () => {
    it.each([
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
      ['', true],
      ['a-1', true],
      ['-', true],
      ['1-a', true],
      ['a_1', false],
      ['.', false],
      [' ', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumDash.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumDashDots', () => {
    it.each([
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
      ['', true],
      ['a-1.', true],
      ['...', true],
      ['-.-', true],
      ['_', false],
      ['a b', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumDashDots.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumDashDotsOrEmpty', () => {
    it.each([
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
      ['', true],
      ['a.b-1', true],
      ['-', true],
      ['_', false],
      ['a b', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumDashDotsOrEmpty.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumDashDotsSpaces', () => {
    it.each([
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
      ['', true],
      ['a b', true],
      ['\t', true],
      ['a.b-1', true],
      ['_', false],
      ['@', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumDashDotsSpaces.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumDashUnderscoreDotsSpacesParenthesis', () => {
    it.each([
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
      ['', true],
      ['a(b)_-.1', true],
      ['( )', true],
      ['@', false],
      ['#', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumDashUnderscoreDotsSpacesParenthesis.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumDashUnderscore', () => {
    it.each([
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
      ['', true],
      ['a_1-', true],
      ['A-B_', true],
      ['a.b', false],
      [' ', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumDashUnderscore.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumDashOrEmpty', () => {
    it.each([
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
      ['', true],
      ['a-1', true],
      ['_', false],
      ['.', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumDashOrEmpty.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumDashSpaces', () => {
    it.each([
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
      ['', true],
      ['a b-1', true],
      ['\t', true],
      ['_', false],
      ['a.b', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumDashSpaces.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumDots', () => {
    it.each([
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
      ['', true],
      ['a.1', true],
      ['..', true],
      ['-', false],
      ['_', false],
      ['a b', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumDots.test(string)).toBe(expected)
    })
  })
  describe('regex alphaUpperUnderscore', () => {
    it.each([
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
      ['ABC_', true],
      ['A_', true],
      ['_', true],
      ['', false],
      ['a', false],
      ['1', false],
      ['-', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphaUpperUnderscore.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumLowercase', () => {
    it.each([
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
      ['a1', true],
      ['abc', true],
      ['', false],
      ['A', false],
      ['-', false],
      ['_', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumLowercase.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumDashLowercase', () => {
    it.each([
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
      ['a1-', true],
      ['a-b', true],
      ['', false],
      ['A', false],
      ['_', false],
      ['.', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumDashLowercase.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumDashUnderscoreDotsSpaces', () => {
    it.each([
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
      ['', true],
      ['a_-.1', true],
      ['\t', true],
      ['@', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumDashUnderscoreDotsSpaces.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumDashUnderscoreDollar', () => {
    it.each([
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
      ['', true],
      ['a_$-1', true],
      ['$', true],
      ['a.b', false],
      ['@', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumDashUnderscoreDollar.test(string)).toBe(expected)
    })
  })

  describe('regex absoluteLinuxPath', () => {
    it.each([
      ...linuxPaths.GOOD.map((testStr: string) => [testStr, true] as [string, boolean]),
      ...linuxPaths.BAD.map((testStr: string) => [testStr, false] as [string, boolean]),
      ['/a', true],
      ['/a/b', true],
      ['/a_b', true],
      ['', true],
      ['/a-', false],
      ['a', false],
      ['/a//b', false],
      ['/a b', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(absoluteLinuxPath.test(string)).toBe(expected)
    })
  })

  describe('regex organizationAlias', () => {
    it.each([
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
      ['ab', true],
      ['a1b', true],
      ['a'.repeat(32), true],
      ['a', false],
      ['a'.repeat(33), false],
      ['A', false],
      ['-', false],
      ['a b', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(organizationAlias.test(string)).toBe(expected)
    })
  })

  describe('regex ascii', () => {
    it.each([
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
      ['a', true],
      ['\u007F', true],
      ['', false],
      ['é', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ascii.test(string)).toBe(expected)
    })
  })

  describe('regex backupKey', () => {
    it.each([
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
      ['A1B2C3D4', true],
      ['A'.repeat(32), true],
      ['A'.repeat(8), true],
      ['A'.repeat(7), false],
      ['A'.repeat(9), false],
      ['A'.repeat(31), false],
      ['A'.repeat(33), false],
      ['a'.repeat(8), false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(backupKey.test(string)).toBe(expected)
    })
  })
  describe('regex basicDomain', () => {
    it.each([
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
      ['example.com', true],
      ['a.b', true],
      ['a-b.com', true],
      ['a.b.c', true],
      ['example', false],
      ['a.', false],
      ['.com', false],
      ['a..com', false],
      ['A.com', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(basicDomain.test(string)).toBe(expected)
    })
  })
  describe('regex uppercaseBasicDomain', () => {
    it.each([
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
      ['Example.com', true],
      ['example.com', true],
      ['a.com', true],
      ['-example.com', false],
      ['a..com', false],
      ['example', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(uppercaseBasicDomain.test(string)).toBe(expected)
    })
  })

  describe('regex uppercaseBasicSubdomain', () => {
    it.each([
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
      ['sub.example.com', true],
      ['SUB.example.com', true],
      ['sub.example', false],
      ['example.com', false],
      ['-sub.example.com', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(uppercaseBasicSubdomain.test(string)).toBe(expected)
    })
  })

  describe('regex advancedDomain', () => {
    it.each([
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
      ['example.com', true],
      ['sub.example.com', true],
      ['täst.de', true],
      ['127.0.0.1', true],
      ['127.0.0.1:8080', true],
      ['example', false],
      ['example.', false],
      ['-example.com', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(advancedDomainName.test(string)).toBe(expected)
    })
  })

  describe('regex cron', () => {
    it.each([
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
      ['0 0 0 * * *', true],
      ['* * * * *', true],
      ['0 0 0 0 0 0 0', true],
      ['0 0 0 0 0 0 0 0', false],
      ['0', false],
      ['0 0 0 0', false],
      ['*/5 * * * *', true],
      ['1-5 * * * *', true],
      ['1,2,3 * * * *', true],
      ['', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(cron.test(string)).toBe(expected)
    })
  })

  describe('regex digits', () => {
    it.each([
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
      ['', true],
      ['0', true],
      ['123', true],
      ['a', false],
      ['-', false],
      ['1a', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(digits.test(string)).toBe(expected)
    })
  })

  describe('regex elevenDigitsCode', () => {
    it.each([
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
      ['01234567890', true],
      ['0123456789', false],
      ['012345678901', false],
      ['a'.repeat(11), false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(elevenDigitsCode.test(string)).toBe(expected)
    })
  })

  describe('regex email', () => {
    it.each([
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
      ['a&b@example.com', true],
      ['john.doe@example.com', true],
      ['.john@example.com', true],
      ['john..doe@example.com', true],
      ['john.@example.com', true],
      ['a!b@example.com', true],
      ['a+b@example.com', true],
      ['a@sub-domain.com', true],
      ['a@-example.com', true],
      ['a@localhost', true],
      ['a@b', true],
      ['@example.com', false],
      ['a@', false],
      ['example.com', false],
      ['a@b@c.com', false],
      ['a b@example.com', false],
      ['a@exa mple.com', false],
      ['a@.example.com', false],
      ['a@example..com', false],
      ['é@example.com', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(email.test(string)).toBe(expected)
    })
  })

  describe('regex fourDigitsCode', () => {
    it.each([
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
      ['0000', true],
      ['9999', true],
      ['123', false],
      ['12345', false],
      ['12a4', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(fourDigitsCode.test(string)).toBe(expected)
    })
  })

  describe('regex nineDigitsCode', () => {
    it.each([
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
      ['012345678', true],
      ['01234567', false],
      ['0123456789', false],
      ['a'.repeat(9), false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(nineDigitsCode.test(string)).toBe(expected)
    })
  })

  describe('regex macAddress', () => {
    it.each([
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
      ['00:11:22:33:44:55', true],
      ['AA:BB:CC:DD:EE:FF', true],
      ['00:11:22:33:44:5', false],
      ['00:11:22:33:44', false],
      ['001122334455', false],
      ['00-11-22-33-44-55', false],
      ['00:11:22:33:44:55:66', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(macAddress.test(string)).toBe(expected)
    })
  })

  describe('regex phone', () => {
    it.each([
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
      ['+', true],
      ['+1', true],
      ['+33607080910', true],
      ['', false],
      ['33607080910', false],
      ['+33 6', true],
      ['+abc', true],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(phone.test(string)).toBe(expected)
    })
  })

  describe('regex spaces', () => {
    it.each([
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
      ['', true],
      [' ', true],
      ['\t\n', true],
      ['a', false],
      [' a', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(spaces.test(string)).toBe(expected)
    })
  })

  describe('regex sixDigitsCode', () => {
    it.each([
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
      ['123456', true],
      ['12345', false],
      ['1234567', false],
      ['12345a', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(sixDigitsCode.test(string)).toBe(expected)
    })
  })

  describe('regex url', () => {
    it.each([
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
      ['https://example.com', true],
      ['https://sub.example.com/path', true],
      ['http://example', false],
      ['example.com', false],
      ['https://', false],
      ['https://example.com?x=1', true],
      ['http://example.com:8080', true],
      ['https://exa_mple.com', true],
      ['http://a.b/', true],
      ['https://example.com/', true],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(url.test(string)).toBe(expected)
    })
  })

  describe('regex hexadecimal', () => {
    it.each([
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
      ['0', true],
      ['aF', true],
      ['deadbeef', true],
      ['', false],
      ['g', false],
      ['0x1F', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(hexadecimal.test(string)).toBe(expected)
    })
  })
  describe('regex s3BucketName', () => {
    it.each([
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
      ['a1b', true],
      ['1ab', true],
      ['my.bucket-1', true],
      ['a..b', true],
      ['a'.repeat(63), true],
      ['ab', false],
      ['a'.repeat(64), false],
      ['A-b', false],
      ['a-', false],
      ['-a1', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(s3BucketName.test(string)).toBe(expected)
    })
  })

  describe('regex ipv4', () => {
    it.each([
      ['192.168.1.1', true],
      ['127.0.0.1', true],
      ['0.0.0.0', true],
      ['255.255.255.255', true],
      ['1.2.3.4 hi', false],
      ['256.256.256.256', false],
      ['999.999.999.999', false],
      ['1.2.3', false],
      ['1.2.3.4', true],
      ['01.02.03.04', false],
      ['256.0.0.1', false],
      ['1.2.3.4.5', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ipv4.test(string)).toBe(expected)
    })
  })

  describe('regex ipv6', () => {
    it.each([
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
      ['::', true],
      ['::1', true],
      ['2001:db8::1', true],
      ['1:2:3:4:5:6:7:8', true],
      ['1:2:3:4:5:6:7:8:9', false],
      ['2001:db8::1 hi', false],
      ['1:2:3:4:5:6:7:8::', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ipv6.test(string)).toBe(expected)
    })
  })

  describe('regex ip', () => {
    it.each([
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
      ['::1', true],
      ['1.2.3.4', true],
      ['1.2.3', false],
      ['256.1.1.1', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ip.test(string)).toBe(expected)
    })
  })

  describe('regex ipCidr', () => {
    it.each([
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
      ['192.168.1.1/0', true],
      ['192.168.1.1/33', false],
      ['1.2.3.4/-1', false],
      ['::1/128', true],
      ['::1/129', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ipCidr.test(string)).toBe(expected)
    })
  })

  describe('regex ipv4Cidr', () => {
    it.each([
      ['192.168.1.1/24', true],
      ['127.0.0.1/32', true],
      ['0.0.0.0/0', true],
      ['255.255.255.255/32', true],
      ['1.2.3.4/0 hi', false],
      ['256.256.256.256/32', false],
      ['999.999.999.999/999', false],
      ['1.2.3/0', false],
      ['1.2.3.4/0', true],
      ['1.2.3.4/32', true],
      ['1.2.3.4/33', false],
      ['1.2.3.4', false],
      ['1.2.3.4/', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ipv4Cidr.test(string)).toBe(expected)
    })
  })

  describe('regex ipv6Cidr', () => {
    it.each([
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
      ['::1/0', true],
      ['::1/128', true],
      ['::1/129', false],
      ['::1', false],
      ['::1/', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(ipv6Cidr.test(string)).toBe(expected)
    })
  })

  describe('regex reverseDNS', () => {
    it.each([
      ['fr.example.test.', true],
      ['fr.exemple.', true],
      ['wrong.fr', false],
      ['a.b.', true],
      ['fr.example.', true],
      ['a.b', false],
      ['.a.b.', false],
      ['a..b.', false],
      ['A.b.', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(reverseDNS.test(string)).toBe(expected)
    })
  })

  describe('regex dashedIpv4', () => {
    it.each([
      ['192-168-1-0', true],
      ['192.168.1.0', false],
      ['1-2-3-4', true],
      ['0-0-0-0', true],
      ['255-255-255-255', true],
      ['1-2-3-4-5', false],
      ['256-1-1-1', false],
      ['1-2-3', false],
      ['a-b-c-d', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(dashedIpv4.test(string)).toBe(expected)
    })
  })

  describe('regex accessKeyRegex', () => {
    it.each([
      ['12301234567891234567', false],
      ['ABCABCDEFGHIJKLMNOPQ', false],
      ['SCWabcdefghijklmnopq', true],
      ['scw01234567891234567', true],
      ['SCW01234567891234567', true],
      ['SCWABCDEFGHIJKLMNOPQ', true],
      ['SCW012345678912345678', false],
      ['SCW0123456789123456', false],
      ['SCW01234567891234567!', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(accessKeyRegex.test(string)).toBe(expected)
    })
  })

  describe('regex pathSegment', () => {
    it.each([
      ['/hello', false],
      ['hello', true],
      ['hello nop', false],
      ['hello?', false],
      ['hello-world', true],
      ['hello/world', false],
      ['/', false],
      ['a', true],
      ['1', true],
      ['a-b_c.d', true],
      ['a1', true],
      ['_', true],
      ['a.b', true],
      ['a_b', true],
      ['', false],
      ['-', false],
      ['a-', false],
      ['-a', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(pathSegment.test(string)).toBe(expected)
    })
  })

  describe('regex absolutePath', () => {
    it.each([
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
      ['/a b', true],
      ['/a-b', true],
      ['/a/', true],
      ['/a b/c', true],
      ['//a', true],
      ['/', false],
      ['/a?', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(absolutePath.test(string)).toBe(expected)
    })
  })

  describe('regex sgPortRange', () => {
    it.each([
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

  describe('regex password', () => {
    it.each([
      ['password', true],
      ['Password123!', true],
      ['Password123!@#', true],
      ['password`', false],
      ['Password`123!@#', false],
      ['@Password123!@#', false],
      ['', true],
      ['abc', true],
      ['a@b', true],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(password.test(string)).toBe(expected)
    })
  })

  describe('regex kafkaUsernameRegex', () => {
    it.each([
      ['username', true],
      ['user-name', true],
      ['my-group.user-name', true],
      ['-user-name', false],
      ['user-Name-', false],
      ['user..name', false],
      ['a', true],
      ['a1', true],
      ['a.b', true],
      ['a.b-c.d', true],
      ['a..b', false],
      ['-a', false],
      ['a-', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(kafkaUsernameRegex.test(string)).toBe(expected)
    })
  })

  describe('regex alphanumDashSegment', () => {
    // Tests a single segment that:
    // - Must start with a letter (A-Z or a-z)
    // - Can contain letters, digits, and hyphens in the middle
    // - Cannot start or end with a hyphen
    // - Must end with a letter or digit
    // - No underscores, dots, or other special characters allowed
    it.each([
      // Valid: starts with letter, ends with alphanum, hyphens in middle
      ['a', true],
      ['Z', true],
      ['name', true],
      ['my-name', true],
      ['my2name', true],
      ['my-name123', true],
      ['A1b-c2d', true],
      ['x-y-z', true],
      ['test1', true],
      ['A', true],
      ['a-b', true],

      // Invalid: does NOT start with a letter
      ['1name', false],
      ['0-test', false],
      ['9', false],

      // Invalid: ends with a hyphen
      ['name-', false],
      ['test-a-', false],
      ['a-', false],

      // Invalid: empty or too short
      ['', false],

      // Invalid: contains forbidden characters (., _, @, !, etc.)
      ['name.', false],
      ['test_test', false],
      ['test@test', false],
      ['hello_world', false],
      ['test!', false],
      ['a..b', false],

      // Invalid: only hyphens or invalid patterns
      ['-', false],
      ['--', false],
      ['a--', false],
      ['a1b', true],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(alphanumDashSegment.test(string)).toBe(expected)
    })
  })

  describe('regex webhostingUsernameEmailRegex', () => {
    it.each([
      ['test', true],
      ['test_test', true],
      ['test-test', true],
      ['test.test', true],
      ['test..test', false],
      ['test.test.', false],
      ['a', false],
      ['ab', true],
      ['.test', false],
      ['test.', false],
      ['test@test', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(webhostingUsernameEmailRegex.test(string)).toBe(expected)
    })
  })

  describe('regex uuid', () => {
    it.each([
      [asciiLetters, false],
      [asciiLowercase, false],
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
      [uuidTest, true],
      ['550E8400-E29B-41D4-A716-446655440000', true],
      ['550e8400e29b41d4a716446655440000', false],
      ['550e8400-e29b-41d4-a716-44665544000', false],
      ['550e8400-e29b-41d4-a716-4466554400000', false],
      ['g50e8400-e29b-41d4-a716-446655440000', false],
    ])('should match regex %s to be %s', (string, expected) => {
      expect(uuid.test(string)).toBe(expected)
    })
  })

  describe('regex urlWithoutProtocol', () => {
    it.each([
      //  Valid URLs without protocol
      ['console.scaleway.com', true],
      ['www.scaleway.com', true],
      ['scaleway.online', true],
      ['255.255.255.255', true],
      ['www.example.com/product', true],
      ['example.com/path/to/resource', true],
      ['sub.domain.example.com', true],
      ['test.co.uk', true],
      ['a.b.c.d.e.f.com', true],
      ['example.com/', true],

      //  Invalid because they contain a port, query‑string or fragment
      ['www.scaleway.com:8080', false],
      ['www.example.com/products?id=1&page=2', false],
      ['www.example.com#up', false],
      ['example.com:443', false],
      ['example.com:8080/path?query=value#hash', false],

      //  Invalid: contains protocol
      ['http://console.scaleway.com', false],
      ['https://www.scaleway.com', false],
      ['ftp://example.com', false],

      //  Invalid: no TLD (single segment)
      ['localhost', false],
      ['example', false],
      ['a', false],

      //  Invalid: empty or whitespace
      ['', false],
      [' ', false],

      //  Invalid: special characters not allowed
      ['example .com', false],
      ['example..com', false],
    ])('should match %s → %s', (input, expected) => {
      expect(urlWithoutProtocol.test(input)).toBe(expected)
    })
  })
})
