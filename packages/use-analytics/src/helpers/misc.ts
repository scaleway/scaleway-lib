export const stringToHash = (str: string): number =>
  [...str].reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) || 0, 0)
