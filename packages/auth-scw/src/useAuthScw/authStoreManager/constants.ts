export const COOKIE_AGE = 3600 * 24 * 31 // 31 days

// location.host will include the port number, so we need to keep it on local case..
// const DOMAIN = typeof window !== 'undefined' ? globalThis.location.host : ''
// keep window as we used this package into e2e node execution
export const DOMAIN = typeof window !== 'undefined' ? globalThis.location.hostname : ''

export const getUniqueHostnameString = (inputString: string) => inputString.replaceAll('.', '_').replaceAll('-', '_')
