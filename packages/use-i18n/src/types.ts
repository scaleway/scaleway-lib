import type {
  BaseLocale,
  LocaleKeys,
  LocaleValue,
  Params,
  ScopedValue,
  Scopes,
} from 'international-types'
import type { ReactNode } from 'react'

export type ReactParamsObject<
  Value extends LocaleValue,
  ReactParams extends boolean = true,
> = Record<
  Params<Value>[number],
  ReactParams extends true ? LocaleValue | ReactNode : LocaleValue
>

export type TranslateFn<
  Locale extends BaseLocale,
  ReactParams extends boolean = true,
> = <
  Key extends LocaleKeys<Locale, undefined>,
  Value extends LocaleValue = ScopedValue<Locale, undefined, Key>,
>(
  key: Key,
  ...params: Params<Value>['length'] extends 0
    ? []
    : [ReactParamsObject<Value, ReactParams>]
) => string

export type ScopedTranslateFn<
  Locale extends BaseLocale,
  ReactParams extends boolean = true,
> = <Scope extends Scopes<Locale>>(
  scope: Scope,
) => <
  Key extends LocaleKeys<Locale, Scope>,
  Value extends LocaleValue = ScopedValue<Locale, Scope, Key>,
>(
  key: Key,
  ...params: Params<Value>['length'] extends 0
    ? []
    : [ReactParamsObject<Value, ReactParams>]
) => string
