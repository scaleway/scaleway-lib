// oxlint-disable typescript/no-empty-object-type
// oxlint-disable typescript/ban-types
// oxlint-disable no-unused-vars

/**
 * This type and ExtractRouteOptionalParam come from react-router but are not exported by `react-router-dom`.
 */
export type ExtractRouteParams<T extends string> = string extends T
  ? { [k in string]?: string }
  : T extends `${infer _Start}:${infer ParamWithOptionalRegExp}/${infer Rest}`
    ? ParamWithOptionalRegExp extends `${infer Param}(${infer _RegExp})${infer Modifier extends '?' | '+' | '*' | ''}`
      ? ExtractRouteOptionalParam<`${Param}${Modifier}`> & ExtractRouteParams<Rest>
      : ExtractRouteOptionalParam<ParamWithOptionalRegExp> & ExtractRouteParams<Rest>
    : T extends `${infer _Start}:${infer ParamWithOptionalRegExp}`
      ? ParamWithOptionalRegExp extends `${infer Param}(${infer _RegExp})${infer Modifier extends '?' | '+' | '*' | ''}`
        ? ExtractRouteOptionalParam<`${Param}${Modifier}`>
        : ExtractRouteOptionalParam<ParamWithOptionalRegExp>
      : {}

export type ExtractRouteOptionalParam<T extends string> = T extends `${infer Param}?`
  ? { [k in Param]?: string }
  : T extends `${infer Param}*`
    ? { [k in Param]?: string[] | string }
    : T extends `${infer Param}+`
      ? { [k in Param]: string[] | string }
      : { [k in T]: string }

export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {}
