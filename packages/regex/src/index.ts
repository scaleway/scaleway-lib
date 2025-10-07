export const accessKeyRegex = /^SCW[A-Z0-9]{17}$/i
export const alpha = /^[a-zA-Z]*$/
export const alphaLowercase = /^[a-z]+$/
export const alphanum = /^[a-zA-Z0-9]*$/
export const alphaDashes = /^[a-zA-Z-]*$/
export const alphanumDash = /^[a-zA-Z0-9-]*$/
export const alphanumDashDots = /^[a-zA-Z0-9-.]*$/
export const alphanumDashDotsOrEmpty = /^$|^[a-zA-Z0-9-.]*$/
export const alphanumDashDotsSpaces = /^[a-zA-Z0-9-.\s]*$/
export const alphanumDashLowercase = /^[a-z0-9-]+$/
export const alphanumDashSpaces = /^[a-zA-Z0-9-\s]*$/
export const alphaUpperUnderscore = /^[A-Z_]+$/

export const alphanumDashOrEmpty = /^$|^[a-zA-Z0-9-]*$/
export const alphanumDashUnderscoreDots = /^[a-zA-Z0-9-._]*$/
export const alphanumDashUnderscore = /^[a-zA-Z0-9-_]*$/
export const alphanumDashUnderscoreDotsSpacesParenthesis =
  /^[a-zA-Z0-9-_.()\s]*$/
export const alphanumDashUnderscoreDotsSpaces = /^[a-zA-Z0-9-.\s_]*$/
export const alphanumDashUnderscoreDollar = /^[a-zA-Z0-9_$-]*$/
export const alphanumDots = /^[a-zA-Z0-9.]*$/
export const alphanumLowercase = /^[a-z0-9]+$/
export const absoluteLinuxPath = /(^\/$|^(\/[a-zA-Z0-9_]+)*$)/

// eslint-disable-next-line no-control-regex
export const ascii = /^[\x00-\x7F]+$/
export const organizationAlias = /^[a-z0-9]{2,32}$/
export const backupKey = /^[A-Z0-9]{8}$|^[A-Z0-9]{32}$/
export const basicDomain = /^[a-z0-9-]+(\.[a-z0-9-]{1,63})+$/
export const uppercaseBasicDomain =
  /^(?![-])+[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]{1,63})+$/
export const uppercaseBasicSubdomain =
  /^(?![-])+[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]{1,63})+$/
// It will include special character that are non ASCII but valid for internationalized domain names (IDN)
export const advancedDomainName =
  /^(?:(?:(?:[a-zA-Z0-9À-ÖØ-öø-ÿ](?:[a-zA-Z0-9À-ÖØ-öø-ÿ-]{0,61}[a-zA-Z0-9À-ÖØ-öø-ÿ])?)\.)+[a-zA-Z]{2,}|(?:[0-9]{1,3}\.){3}[0-9]{1,3})(?::[\d]{1,5})?$/

export const cron = /^((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*|\*\/\d+) ?){5,7})$/
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
export const nineDigitsCode = /^[0-9]{9}$/
export const elevenDigitsCode = /^[0-9]{11}$/
export const url =
  /^http(s)?:\/\/?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
export const hexadecimal = /^[0-9a-fA-F]+$/
export const s3BucketName = /^[a-z0-9][-.a-z0-9]{1,61}[a-z0-9]$/
export const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

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
export const reverseDNS = /^[a-z0-9-]+(\.[a-z0-9-]{1,63})+(\.)$/
export const dashedIpv4 =
  /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(-(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/

export const pathSegment = /^[_a-zA-Z0-9]([-_.a-zA-Z0-9]*[_a-zA-Z0-9])?$/
export const absolutePath = /^\/(([\w. -]*)[^\s?]\/?)+$/

// A port range between 1 to 65535 separated by an hypen or a single number
export const sgPortRange =
  /^(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5]?[0-9]{1,4})(-(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5]?[0-9]{1,4}))?$/

// Include all characters except backtick ` and @ as first character
export const password = /^(?!@)[^`]*$/

// A kafka username contains lowercase letters and numbers, with each segment starting and ending with a letter or number. Hyphens are only allowed in the middle of segments. Example: "username", "user-name", "my-group.user-name"
export const kafkaUsernameRegex =
  /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/

export const json = /({(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*})/s
