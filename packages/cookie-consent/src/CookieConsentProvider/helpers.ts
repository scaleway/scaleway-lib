export const categories = [
  'essential',
  'functional',
  'marketing',
  'analytics',
  'advertising',
] as const

export type CategoryKind = (typeof categories)[number]

export const IS_CLIENT = typeof document !== 'undefined'

export const isCategoryKind = (key: string): key is CategoryKind =>
  categories.includes(key as CategoryKind)
