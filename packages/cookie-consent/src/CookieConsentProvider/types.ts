export type CategoryKind =
  | 'essential'
  | 'functional'
  | 'marketing'
  | 'analytics'
  | 'advertising'

export type Consent = { [K in CategoryKind]: boolean }

type Integration = { category: CategoryKind; name: string }

export type Integrations = Integration[]

// TODO: avoid duplicating this type in @shire/console
export type Config = {
  segment?: {
    writeKey: string
    cdnURL: string
  } | null
}
