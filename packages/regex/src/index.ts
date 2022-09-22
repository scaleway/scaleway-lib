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
export const basicDomainNotStrict =
  /^(?![-])+[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]{1,63})+$/

export const cron = /^[0-9,/*-]+$/
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
