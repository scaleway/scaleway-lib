export const stringToHash = (str: string): number =>
  // oxlint-disable-next-line typescript/no-misused-spread
  [...str].reduce((h, c) => Math.imul(31, h) + (c.codePointAt(0) ?? 0), 0)
