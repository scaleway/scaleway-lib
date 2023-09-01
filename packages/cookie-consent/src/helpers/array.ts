// TODO: avoid duplicating this function in @shire/console
export const uniq = <T>(array: T[]): T[] => [...new Set(array)]
