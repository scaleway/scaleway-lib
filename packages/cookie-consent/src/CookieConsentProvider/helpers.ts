export const categories = [
  'essential',
  'functional',
  'marketing',
  'analytics',
  'advertising',
] as const

export type CategoryKind = (typeof categories)[number]

export const isCategoryKind = (key: string): key is CategoryKind =>
  categories.includes(key as CategoryKind)

export const IS_CLIENT: boolean = typeof document !== 'undefined'
