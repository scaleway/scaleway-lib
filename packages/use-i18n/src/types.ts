export type LocaleParam<Value extends string> = Value extends ''
  ? []
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Value extends `${infer StartValue}{${infer Param}}${infer EndValue}`
  ? [Param, ...LocaleParam<EndValue>]
  : []

export type JoinScoped<
  Locale extends Record<string, string>,
  Scope extends PossibleScopes<Locale>,
  Key extends PossibleKeys<Locale, Scope>,
> = `${Scope}.${Key}`

export type ConstructScopeFromPrev<
  Scope extends string,
  PrevScope extends string,
> = PrevScope extends '' ? Scope : `${PrevScope}.${Scope}`

export type PossibleScopesTuple<
  Locale extends Record<string, string>,
  Key = keyof Locale,
  PrevScope extends string = '',
> = Key extends `${infer Scope}.${infer EndValue}`
  ? [
      ConstructScopeFromPrev<Scope, PrevScope>,
      ...PossibleScopesTuple<Locale, EndValue, Scope>,
    ]
  : []

export type PossibleScopes<Locale extends Record<string, string>> =
  PossibleScopesTuple<Locale, keyof Locale>[number]

export type PossibleKeys<
  Locale extends Record<string, string>,
  Scope extends PossibleScopes<Locale>,
  Key = keyof Locale,
> = Key extends `${Scope}.${infer EndValue}` ? EndValue : never

export type TranslateFn<
  Locale extends Record<string, string> = Record<string, string>,
> = <
  Key extends keyof Locale,
  Param extends Record<LocaleParam<Locale[Key]>[number], string>,
>(
  key: Key,
  params?: Param,
) => string

export type ScopedTranslateFn<
  Locale extends Record<string, string> = Record<string, string>,
> = <Scope extends PossibleScopes<Locale>>(
  scope: Scope,
) => <
  ScopedKey extends PossibleKeys<Locale, Scope>,
  Param extends Record<
    LocaleParam<Locale[JoinScoped<Locale, Scope, ScopedKey>]>[number],
    string
  >,
>(
  key: ScopedKey,
  params?: Param,
) => string
