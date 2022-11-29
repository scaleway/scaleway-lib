export const alpha = /^[a-zA-Z]*$/
export const alphaLower = /^[a-z]+$/
export const alphanum = /^[a-zA-Z0-9]*$/
export const alphaDashes = /^[a-zA-Z-]*$/
export const alphanumdash = /^[a-zA-Z0-9-]*$/
export const alphanumdashdots = /^[a-zA-Z0-9-.]*$/
export const alphanumdashdotsorempty = /^$|^[a-zA-Z0-9-.]*$/
export const alphanumdashdotsspaces = /^[a-zA-Z0-9-.\s]*$/
export const alphanumdashorempty = /^$|^[a-zA-Z0-9-]*$/
export const alphanumdashspaces = /^[a-zA-Z0-9-\s]*$/
export const alphanumdots = /^[a-zA-Z0-9.]*$/
export const alphanumLowercase = /^[a-z0-9]+$/
export const alphanumSpacesDotsUnderscoreDash = /^[a-zA-Z0-9-.\s_]*$/
export const alphanumUnderscoreDash = /^[a-zA-Z0-9_-]*$/
export const alphanumUnderscoreDollarDash = /^[a-zA-Z0-9_$-]*$/
export const absoluteLinuxPath = /(^\/$|^(\/[a-zA-Z0-9_]+)*$)/

// eslint-disable-next-line no-control-regex
export const ascii = /^[\x00-\x7F]+$/
export const backupKey = /^[A-Z0-9]{32}$/
export const basicDomain = /^[a-z0-9-]+(\.[a-z0-9-]{1,63})+$/
export const uppercaseBasicDomain =
  /^(?![-])+[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]{1,63})+$/

export const cron = /^((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/
export const digits = /^[0-9]*$/
export const macAddress =
  /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/
// Used by W3C
export const email =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
export const fourDigitsCode = /^[0-9]{4}$/
export const phone = /^\+[0-9]*/
export const spaces = /^\s*$/
export const sixDigitsCode = /^[0-9]{6}$/
export const url =
  /^http(s)?:\/\/?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
export const hexadecimal = /^[0-9a-fA-F]+$/
export const s3BucketName = /^[a-z0-9][-.a-z0-9]{1,61}[a-z0-9]$/

// Pasted from `ip-regex` package (https://github.com/sindresorhus/ip-regex/blob/main/index.js)
const v4 =
  '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}'
const v6segment = '[a-fA-F\\d]{1,4}'
const v6 = `
(?:
(?:${v6segment}:){7}(?:${v6segment}|:)|
(?:${v6segment}:){6}(?:${v4}|:${v6segment}|:)|
(?:${v6segment}:){5}(?::${v4}|(?::${v6segment}){1,2}|:)|
(?:${v6segment}:){4}(?:(?::${v6segment}){0,1}:${v4}|(?::${v6segment}){1,3}|:)|
(?:${v6segment}:){3}(?:(?::${v6segment}){0,2}:${v4}|(?::${v6segment}){1,4}|:)|
(?:${v6segment}:){2}(?:(?::${v6segment}){0,3}:${v4}|(?::${v6segment}){1,5}|:)|
(?:${v6segment}:){1}(?:(?::${v6segment}){0,4}:${v4}|(?::${v6segment}){1,6}|:)|
(?::(?:(?::${v6segment}){0,5}:${v4}|(?::${v6segment}){1,7}|:))
)(?:%[0-9a-zA-Z]{1,})?
`
  .replace(/\s*\/\/.*$/gm, '')
  .replace(/\n/g, '')
  .trim()

// Pasted from `cidr-regex` package (https://github.com/silverwind/cidr-regex/blob/master/index.js)
const cidrv4 = `${v4}\\/(3[0-2]|[12]?[0-9])`
const cidrv6 = `${v6}\\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])`

export const ip = new RegExp(`^(?:${v4}|${v6})$`)
export const ipv4 = new RegExp(`^${v4}$`)
export const ipv6 = new RegExp(`^${v6}$`)
export const ipCidr = new RegExp(`(?:^${cidrv4}$)|(?:^${cidrv6}$)`)
export const ipv4Cidr = new RegExp(`^${cidrv4}$`)
export const ipv6Cidr = new RegExp(`^${cidrv6}$`)
