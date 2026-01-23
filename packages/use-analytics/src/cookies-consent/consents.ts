import { CATEGORIES } from '../constants'
import type { CategoryKind, Consent } from '../types'

export const isCategoryKind = (key: string): key is CategoryKind =>
  CATEGORIES.includes(key as CategoryKind)

export const getAllowedConsents: (c: Partial<Consent>) => CategoryKind[] =
  consent =>
    Object.keys(consent).filter((key): key is CategoryKind => {
      if (!isCategoryKind(key)) {
        return false
      }

      return consent[key] ?? false
    })

export const getDeniedConsents: (c: Partial<Consent>) => CategoryKind[] =
  consent =>
    Object.keys(consent).filter(
      (key): key is CategoryKind =>
        !getAllowedConsents(consent).includes(key as CategoryKind),
    )
