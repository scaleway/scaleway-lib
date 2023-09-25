export const stringToHash = (str: string): number =>
  Array.from(str).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) || 0, 0)
