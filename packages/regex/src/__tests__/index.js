import {
  alpha,
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
  cron,
  digits,
  email,
  fourDigitsCode,
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

describe('@regex', () => {
  describe('alpha', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(alpha.test(string)).toBe(result)),
    )
  })

  describe('alphanum', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(alphanum.test(string)).toBe(result)),
    )
  })

  describe('alphanumdash', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(alphanumdash.test(string)).toBe(result)),
    )
  })

  describe('alphanumdashdots', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(alphanumdashdots.test(string)).toBe(result)),
    )
  })

  describe('alphanumdashdotsorempty', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(alphanumdashdotsorempty.test(string)).toBe(result)),
    )
  })

  describe('alphanumdashdotsspaces', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(alphanumdashdotsspaces.test(string)).toBe(result)),
    )
  })

  describe('alphanumdashorempty', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(alphanumdashorempty.test(string)).toBe(result)),
    )
  })

  describe('alphanumdashspaces', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(alphanumdashspaces.test(string)).toBe(result)),
    )
  })

  describe('alphanumdots', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(alphanumdots.test(string)).toBe(result)),
    )
  })

  describe('alphanumLowercase', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(alphanumLowercase.test(string)).toBe(result)),
    )
  })

  describe('alphanumSpacesDotsUnderscoreDash', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(alphanumSpacesDotsUnderscoreDash.test(string)).toBe(result)),
    )
  })

  describe('alphanumUnderscoreDash', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(alphanumUnderscoreDash.test(string)).toBe(result)),
    )
  })

  describe('alphanumUnderscoreDollarDash', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(alphanumUnderscoreDollarDash.test(string)).toBe(result)),
    )
  })

  describe('ascii', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(ascii.test(string)).toBe(result)),
    )
  })

  describe('backupKey', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(backupKey.test(string)).toBe(result)),
    )
  })

  describe('cron', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(cron.test(string)).toBe(result)),
    )
  })

  describe('digits', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(digits.test(string)).toBe(result)),
    )
  })

  describe('email', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(email.test(string)).toBe(result)),
    )
  })

  describe('fourDigitsCode', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(fourDigitsCode.test(string)).toBe(result)),
    )
  })

  describe('macAddress', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(macAddress.test(string)).toBe(result)),
    )
  })

  describe('phone', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(phone.test(string)).toBe(result)),
    )
  })

  describe('spaces', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(spaces.test(string)).toBe(result)),
    )
  })

  describe('sixDigitsCode', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(sixDigitsCode.test(string)).toBe(result)),
    )
  })

  describe('url', () => {
    ;[
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
    ].forEach(([string, result]) =>
      it(`should match regex ${string} to be ${result}`, () =>
        expect(url.test(string)).toBe(result)),
    )
  })
})
