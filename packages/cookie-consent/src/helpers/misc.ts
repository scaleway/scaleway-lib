// TODO: avoid duplicating this function in @shire/console
export const stringToHash = (str = ''): number =>
  Array.from(str).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) || 0, 0)
