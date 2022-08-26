import type {
  BaseLocale,
  LocaleKeys,
  LocaleValue,
  Params,
  ParamsObject,
  ScopedValue,
  Scopes,
} from 'international-types'

export type TranslateFn<Locale extends BaseLocale> = <
  Key extends LocaleKeys<Locale, undefined>,
  Value extends LocaleValue = ScopedValue<Locale, undefined, Key>,
>(
  key: Key,
  ...params: Params<Value>['length'] extends 0 ? [] : [ParamsObject<Value>]
) => string

export type ScopedTranslateFn<Locale extends BaseLocale> = <
  Scope extends Scopes<Locale>,
>(
  scope: Scope,
) => <
  Key extends LocaleKeys<Locale, Scope>,
  Value extends LocaleValue = ScopedValue<Locale, Scope, Key>,
>(
  key: Key,
  ...params: Params<Value>['length'] extends 0 ? [] : [ParamsObject<Value>]
) => string
