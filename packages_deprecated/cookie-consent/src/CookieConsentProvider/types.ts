import type { categories } from './helpers'

export type CategoryKind = (typeof categories)[number]

export type Consent = { [K in CategoryKind]: boolean }

type Integration = {
  category: CategoryKind
  name: string
}

export type Integrations = Integration[]

export type Config = {
  segment?: {
    writeKey: string
    cdnURL: string
  } | null
}
