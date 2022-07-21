/**
 * A locale object which is a record of string:string, with an optional `prefix` with is
 * also a string.
 */
export type LocaleObject = Record<string, string> & {
  prefix?: string
}

type ExcludePrefix<
  Locale extends LocaleObject,
  Key extends string = Extract<keyof Locale, string>,
> = Key extends 'prefix' ? never : Key

/**
 * PrefixedKey is used to generate the keys of the locale object, optionaly prefixed with
 * `prefix`.
 *
 * @see LocaleObject
 */
export type PrefixedKey<
  Locale extends LocaleObject,
  Key extends string = ExcludePrefix<Locale>,
> = Locale extends { prefix: string } ? `${Locale['prefix']}.${Key}` : Key

/**
 * LocaleParam is the type that allows to extract params in a locale  value, represented
 * by {param} inside the string (e.g Value="This is an {type} example {what}"). You can
 * have multiple params in a single value, so this type is called recursively until no
 * params are found. It returns a tuple of all the params found (e.g ["type", "what"]).
 *
 * @example
 * LocaleParam<"This is an {exampe}"> = ["example"]
 * LocaleParam<"This is an {exampe} with a second {param}"> = ["example", "param"]
 */
export type LocaleParam<Value extends string> = Value extends ''
  ? []
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Value extends `${infer StartValue}{${infer Param}}${infer EndValue}`
  ? [Param, ...LocaleParam<EndValue>]
  : []

/**
 * Join a scope and a key with a dot, excluding the prefix.
 *
 * @example
 * JoinScope<Locale, "my.scope", "key"> = "my.scope.key"
 * JoinScope<Locale, "my", "awesome.key"> = "my.awesome.key"
 */
export type JoinScoped<
  Locale extends LocaleObject,
  Scope extends PossibleScopes<Locale>,
  Key extends PossibleKeys<Locale, Scope>,
> = Locale extends { prefix: string }
  ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Scope extends `${infer Prefix}.${infer Rest}`
    ? `${Rest}.${Key}`
    : Key
  : `${Scope}.${Key}`

/**
 * JoinScopeWithPrev is an utility type to join the previous scope with the current
 * one. It may return only the scopep if the previous scope is empty.
 *
 * @example
 * JoinScopeWithPrev<"with.scope", "key"> = "key.with.scope"
 * JoinScopeWithPrev<"with.scope", ""> = "with.scope"
 */
export type JoinScopeWithPrev<
  Scope extends string,
  PrevScope extends string,
> = PrevScope extends '' ? Scope : `${PrevScope}.${Scope}` | Scope

/**
 * PossibleScopesTuple is a tuple of all the possible scopes for a locale. It's called
 * recursively similar to LocaleParam, to extract all the scopes.
 *
 * @example
 * type Locale = {
 *   "hello": "value"
 *   "hello.world": "value"
 *   "hello.world.again": "value"
 * }
 *
 * // Note that `hello` is not included here
 * PossibleScopesTuple<Locale> = ["hello.world", "hello.world.again"]
 *
 * @see JoinScopeWithPrev
 * @see PossibleScopes
 */
export type PossibleScopesTuple<
  Locale extends LocaleObject,
  Key = PrefixedKey<Locale>,
  PrevScope extends string = '',
> = Key extends `${infer Scope}.${infer EndValue}`
  ? [
      JoinScopeWithPrev<Scope, PrevScope>,
      ...PossibleScopesTuple<Locale, EndValue, Scope>,
    ]
  : []

/**
 * PossibleScopes is an utility type above PossibleScopesTuple that indexes the tuple of
 * scopes with `number` to return an union of all the possible scopes.
 *
 * @example
 * type Locale = {
 *   "hello": "value"
 *   "hello.world": "value"
 *   "hello.world.again": "value"
 * }
 *
 * PossibleScopes<Locale> = "hello.world" | "hello.world.again"
 *
 * @see PossibleScopesTuple
 */
export type PossibleScopes<Locale extends LocaleObject> = PossibleScopesTuple<
  Locale,
  PrefixedKey<Locale>
>[number]

/**
 * Based on the PossibleScopes union, PossibleKeys generate an union of the possible scoped
 * keys (e.g "scope.key", "scope" is the scope, "key" is the scoped key).
 *
 * @example
 * type Locale = {
 *   "hello": "value"
 *   "hello.world": "value"
 *   "hello.world.again": "value"
 * }
 *
 * PossibleKeys<Locale, "hello"> = "world" | "world.again"
 * PossibleKeys<Locale, "hello.world"> = "again"
 */
export type PossibleKeys<
  Locale extends LocaleObject,
  Scope extends PossibleScopes<Locale>,
  Key = PrefixedKey<Locale>,
> = Key extends `${Scope}.${infer EndValue}` ? EndValue : never

/**
 * The basic t function. key is obviously `keyof Locale` to get an union of the available
 * keys. param is a `Record` of the LocaleParam tuple in keys, indexed with `number` to
 * transform it in an union, and string in values.
 *
 * @see LocaleParam
 */
export type TranslateFn<Locale extends LocaleObject> = <
  Key extends PrefixedKey<Locale>,
  Param extends LocaleParam<Locale[Key]>,
>(
  key: Key,
  ...params: Param['length'] extends 0 ? [] : [Record<Param[number], string>]
) => string

/**
 * Similar but more complicated than t, ScopedTranslationFn is used for `namespaceTranslation`
 * to generate a `scopedT` function. It allows to scope all the next locales with the given
 * key (=Scope), and returns a similar function as t. Scope is one of the PossibleScopes union,
 * and Param is generated based on joining the Scope and ScopedKey with JoinScoped.
 *
 * @see LocaleParam
 * @see JoinScoped
 */
export type ScopedTranslateFn<Locale extends LocaleObject> = <
  Scope extends PossibleScopes<Locale>,
>(
  scope: Scope,
) => <
  ScopedKey extends PossibleKeys<Locale, Scope>,
  Param extends LocaleParam<Locale[JoinScoped<Locale, Scope, ScopedKey>]>,
>(
  key: ScopedKey,
  ...params: Param['length'] extends 0 ? [] : [Record<Param[number], string>]
) => string
