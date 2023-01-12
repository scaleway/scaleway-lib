import {
  absoluteLinuxPath,
  advancedDomainName,
  alpha,
  alphaDashes,
  alphaLower,
  alphanum,
  alphanumLowercase,
  alphanumSpacesDotsUnderscoreDash,
  alphanumUnderscoreDash,
  alphanumUnderscoreDollarDash,
  alphanumdash,
  alphanumdashLowercase,
  alphanumdashdots,
  alphanumdashdotsorempty,
  alphanumdashdotsspaces,
  alphanumdashorempty,
  alphanumdashspaces,
  alphanumdashunderscoredotsspacesparenthesis,
  alphanumdots,
  ascii,
  backupKey,
  basicDomain,
  cron,
  dashedIpv4,
  digits,
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
  phone,
  reverseDNS,
  s3BucketName,
  sixDigitsCode,
  spaces,
  uppercaseBasicDomain,
  url,
} from '..'

const alphanumdashdotsText = 'testwithdashdots-.'
const alphanumdashunderscoredotsparenthesisText = 'testwithdashdots-_. ()'
const alphanumdashText = 'testwithdash-'
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
const cronTest = '0 0 0 * * 0 1-4'
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

  describe('alphaDashes', () => {
    test.each([
      [alphanumdashText, true],
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
      expect(alphaDashes.test(string)).toBe(expected)
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

  describe('alphanumdashunderscoredotsspacesparenthesis', () => {
    test.each([
      [alphanumdashText, true],
      [alphanumdashdotsText, true],
      [alphanumdashunderscoredotsparenthesisText, true],
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
      expect(alphanumdashunderscoredotsspacesparenthesis.test(string)).toBe(
        expected,
      )
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
      [alphanumdashText, false],
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

  describe('alphanumdashLowercase', () => {
    test.each([
      [asciiLetters, false],
      [asciiLowercase, true],
      [alphanumdashText, true],
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
      expect(alphanumdashLowercase.test(string)).toBe(expected)
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
})
