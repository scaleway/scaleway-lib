export const COOKIE_AGE = 3600 * 24 * 31 // 31 days

// Keep `window` reference — this package runs in both browser and e2e Node contexts.
// In Node, `window` is undefined so we fall back to an empty domain.
export const DOMAIN = typeof window !== 'undefined' ? globalThis.location.hostname : ''

export const getUniqueHostnameString = (inputString: string) => inputString.replaceAll('.', '_').replaceAll('-', '_')
