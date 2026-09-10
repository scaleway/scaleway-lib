// oxlint-disable typescript/no-inferrable-types

export const accessKeyRegex: RegExp = /^SCW[A-Z0-9]{17}$/iv
export const alpha: RegExp = /^[a-zA-Z]*$/v
export const alphaLowercase: RegExp = /^[a-z]+$/v
export const alphanum: RegExp = /^[a-zA-Z0-9]*$/v
export const alphaDashes: RegExp = /^[a-zA-Z\-]*$/v
export const alphanumDash: RegExp = /^[a-zA-Z0-9\-]*$/v
export const alphanumDashDots: RegExp = /^[a-zA-Z0-9\-.]*$/v
export const alphanumDashDotsOrEmpty: RegExp = /^$|^[a-zA-Z0-9\-.]*$/v
export const alphanumDashDotsSpaces: RegExp = /^[a-zA-Z0-9\-.\s]*$/v
export const alphanumDashLowercase: RegExp = /^[a-z0-9\-]+$/v
// This regex must start with a lettern can contain letters digits and hyphens, cannot end with a hyphen
export const alphanumDashSegment: RegExp = /^[A-Za-z](?:[A-Za-z0-9\-]*[A-Za-z0-9])?$/v
export const alphanumDashSpaces: RegExp = /^[a-zA-Z0-9\-\s]*$/v
export const alphaUpperUnderscore: RegExp = /^[A-Z_]+$/v

export const alphanumDashOrEmpty: RegExp = /^$|^[a-zA-Z0-9\-]*$/v
export const alphanumDashUnderscoreDots: RegExp = /^[a-zA-Z0-9\-._]*$/v
export const alphanumDashUnderscore: RegExp = /^[a-zA-Z0-9\-_]*$/v
export const alphanumDashUnderscoreDotsSpacesParenthesis: RegExp = /^[a-zA-Z0-9\-_.\(\)\s]*$/v
export const alphanumDashUnderscoreDotsSpaces: RegExp = /^[a-zA-Z0-9\-.\s_]*$/v
export const alphanumDashUnderscoreDollar: RegExp = /^[a-zA-Z0-9_$\-]*$/v
export const alphanumDots: RegExp = /^[a-zA-Z0-9.]*$/v
export const alphanumLowercase: RegExp = /^[a-z0-9]+$/v
export const absoluteLinuxPath: RegExp = /(?:^\/$|^(?:\/[a-zA-Z0-9_]+)*$)/v

// oxlint-disable-next-line eslint/no-control-regex
export const ascii: RegExp = /^[\u0000-\u007F]+$/v
export const organizationAlias: RegExp = /^[a-z0-9]{2,32}$/v
export const backupKey: RegExp = /^[A-Z0-9]{8}$|^[A-Z0-9]{32}$/v
export const basicDomain: RegExp = /^[a-z0-9\-]+(?:\.[a-z0-9\-]{1,63})+$/v
export const uppercaseBasicDomain: RegExp = /^(?![\-])[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]{1,63})+$/v
export const uppercaseBasicSubdomain: RegExp = /^(?![\-])[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]{1,63})+$/v
// It will include special character that are non ASCII but valid for internationalized domain names (IDN)
export const advancedDomainName: RegExp =
  /^(?:(?:(?:[a-zA-Z0-9À-ÖØ-öø-ÿ](?:[a-zA-Z0-9À-ÖØ-öø-ÿ\-]{0,61}[a-zA-Z0-9À-ÖØ-öø-ÿ])?)\.)+[a-zA-Z]{2,}|(?:[0-9]{1,3}\.){3}[0-9]{1,3})(?::[\d]{1,5})?$/v

export const cron: RegExp = /^(?:(?:(?:(?:\d+,)+\d+|(?:\d+(?:\/|-)\d+)|\d+|\*|\*\/\d+) ?){5,7})$/v
export const digits: RegExp = /^[0-9]*$/v
export const macAddress: RegExp = /^(?:[0-9a-fA-F][0-9a-fA-F]:){5}(?:[0-9a-fA-F][0-9a-fA-F])$/v
// Used by W3C
export const email: RegExp = /^[&a-zA-Z0-9.!#$%’*+\/=?^_`\{\|\}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/v
export const fourDigitsCode: RegExp = /^[0-9]{4}$/v
export const phone: RegExp = /^\+[0-9]*/v
export const spaces: RegExp = /^\s*$/v
export const sixDigitsCode: RegExp = /^[0-9]{6}$/v
export const nineDigitsCode: RegExp = /^[0-9]{9}$/v
export const elevenDigitsCode: RegExp = /^[0-9]{11}$/v
export const url: RegExp = /^http(?:s)?:\/\/?[\w.\-]+(?:\.[\w.\-]+)+[&\w\-._~:\/?#\[\]@!$'\(\)*+,;=.]+$/v
export const urlWithoutProtocol =
  /^(?:(?:[a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})(?:\/[&A-Za-z0-9._~!$'\(\)*+,;=:@\-]*)*$/v
export const hexadecimal: RegExp = /^[0-9a-fA-F]+$/v
export const s3BucketName: RegExp = /^[a-z0-9][\-.a-z0-9]{1,61}[a-z0-9]$/v
export const uuid: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iv

// Pasted from `ip-regex` package (https://github.com/sindresorhus/ip-regex/blob/main/index.js)
const v4: string = String.raw`(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}`
const v6segment: string = String.raw`[a-fA-F\d]{1,4}`
const v6: string = `
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
  .replaceAll(/\s*\/\/.*$/gmv, '')
  .replaceAll('\n', '')
  .trim()

// Pasted from `cidr-regex` package (https://github.com/silverwind/cidr-regex/blob/master/index.js)
const cidrv4: string = `${v4}\\/(3[0-2]|[12]?[0-9])`
const cidrv6: string = `${v6}\\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])`

export const ip: RegExp = new RegExp(`^(?:${v4}|${v6})$`, 'v')
export const ipv4: RegExp = new RegExp(`^${v4}$`, 'v')
export const ipv6: RegExp = new RegExp(`^${v6}$`, 'v')
export const ipCidr: RegExp = new RegExp(`(?:^${cidrv4}$)|(?:^${cidrv6}$)`, 'v')
export const ipv4Cidr: RegExp = new RegExp(`^${cidrv4}$`, 'v')
export const ipv6Cidr: RegExp = new RegExp(`^${cidrv6}$`, 'v')
export const reverseDNS: RegExp = /^[a-z0-9\-]+(?:\.[a-z0-9\-]{1,63})+(?:\.)$/v
export const dashedIpv4: RegExp =
  /^(?:\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(?:-(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/v

export const pathSegment: RegExp = /^[_a-zA-Z0-9](?:[\-_.a-zA-Z0-9]*[_a-zA-Z0-9])?$/v
export const absolutePath: RegExp = /^\/(?:(?:[\w. \-]*)[^\s?]\/?)+$/v

// A port range between 1 to 65535 separated by an hypen or a single number
export const sgPortRange: RegExp =
  /^(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5]?[0-9]{1,4})(?:-(?:6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5]?[0-9]{1,4}))?$/v

// Include all characters except backtick ` and @ as first character
export const password: RegExp = /^(?!@)[^`]*$/v

// A kafka username contains lowercase letters and numbers, with each segment starting and ending with a letter or number. Hyphens are only allowed in the middle of segments. Example: "username", "user-name", "my-group.user-name"
export const kafkaUsernameRegex: RegExp = /^[a-z0-9](?:[\-a-z0-9]*[a-z0-9])?(?:\.[a-z0-9](?:[\-a-z0-9]*[a-z0-9])?)*$/v

// The username cannot begin or end with a period, cannot contain two consecutive periods, and can only contain letters, numbers, periods, hyphens, and underscores. Example: "test", "test_test", "test-test"
export const webhostingUsernameEmailRegex: RegExp = /^(?!.*\.\.)[a-zA-Z0-9_\-][a-zA-Z0-9._\-]*[a-zA-Z0-9_\-]$/v
