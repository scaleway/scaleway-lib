/**
 * Type-safe i18n utility types.
 *
 * Vendored in-house from `international-types@0.8.1`
 * (https://github.com/QuiiBz/next-international, MIT, Copyright (c) 2022 Tom Lienard).
 * Adapted for this package: no `key#suffix` plural convention (unsupported at runtime),
 * and `Params` matches CLDR plural categories (`zero`/`one`/`two`/`few`/`many`/`other`).
 */

export type LocaleValue = string | number | boolean | null | undefined | Date

export type BaseLocale = Record<string, LocaleValue>

type ExtractParams<Value extends LocaleValue> = Value extends ''
  ? []
  : Value extends `${string}{${infer Param}}${infer Tail}`
    ? [Param, ...ExtractParams<Tail>]
    : []

// plural messages: cheap shape-guard first so non-plural messages skip the
// selector-union templates entirely (each union member per slot is a match
// attempt: 7 selectors x 3 slots = 343 attempts, measured ~5x check-time).
// Known limits: mixed selectors (=0 + one + other) and category plurals with
// nested braces fall back to generic extraction; upgrade to a recursive
// matcher if real locales hit those.
type NumericDelim = `=${number}` | 'other'
type CategoryDelim = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'

export type Params<Value extends LocaleValue> = Value extends ''
  ? []
  : Value extends `${string}, plural, ${string}`
    ? Value extends `{${infer Param}, plural, ${NumericDelim} {${infer Content}} ${NumericDelim} {${infer Content2}} ${NumericDelim} {${infer Content3}}`
      ? [Param, ...ExtractParams<Content>, ...ExtractParams<Content2>, ...ExtractParams<Content3>]
      : Value extends `{${infer Param}, plural, ${NumericDelim} {${infer Content}} ${NumericDelim} {${infer Content2}}`
        ? [Param, ...ExtractParams<Content>, ...ExtractParams<Content2>]
        : Value extends `{${infer Param}, plural, ${CategoryDelim} {${infer Content}} ${CategoryDelim} {${infer Content2}} ${CategoryDelim} {${infer Content3}}`
          ? [Param, ...ExtractParams<Content>, ...ExtractParams<Content2>, ...ExtractParams<Content3>]
          : Value extends `{${infer Param}, plural, ${CategoryDelim} {${infer Content}} ${CategoryDelim} {${infer Content2}}`
            ? [Param, ...ExtractParams<Content>, ...ExtractParams<Content2>]
            : Value extends `${string}{${infer Param}}${infer Tail}`
              ? [Param, ...Params<Tail>]
              : []
    : Value extends `${string}{${infer Param}}${infer Tail}`
      ? [Param, ...Params<Tail>]
      : []

type ExtractScopes<
  Value extends string,
  Prev extends string | undefined = undefined,
> = Value extends `${infer Head}.${infer Tail}`
  ? [
      Prev extends string ? `${Prev}.${Head}` : Head,
      ...ExtractScopes<Tail, Prev extends string ? `${Prev}.${Head}` : Head>,
    ]
  : []

export type Scopes<Locale extends BaseLocale> = ExtractScopes<Extract<keyof Locale, string>>[number]

export type LocaleKeys<
  Locale extends BaseLocale,
  Scope extends Scopes<Locale> | undefined,
  Key extends string = Extract<keyof Locale, string>,
> = Scope extends undefined ? Key : Key extends `${Scope}.${infer Test}` ? Test : never
