/**
 * Converts a string union (e.g. 'a' | 'b' | 'c') into a tuple of every possible permutation
 * (e.g. ['a','b','c'], ['a','c','b'], ...) by recursively excluding each member.
 * NOTE: may exceed TypeScript's recursion depth limit for large unions.
 */
export type TupleUnion<U extends string, R extends string[] = []> = {
  [S in U]: Exclude<U, S> extends never ? [...R, S] : TupleUnion<Exclude<U, S>, [...R, S]>
}[U]

/**
 * TupleUnion performs too many recursion for typescript's liking.
 * So we use a custom type which is a bit more performant by keeping ordering.
 * This type is intended to be used when TupleUnion breaks.
 */

/**
 * Converts a union type (e.g. A | B) into an intersection type (A & B).
 * It does this by distributing each union member into a function parameter,
 * then inferring the parameter type, which collapses the union into an intersection.
 */
export type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void
  ? I
  : never

/**
 * Extracts the last member of a union by turning each member into a function
 * signature and intersecting them, then inferring the return type.
 */
export type LastOf<T> = UnionToIntersection<T extends unknown ? () => T : never> extends () => infer R ? R : never

/**
 * Converts a union into a tuple preserving the order of members (unlike TupleUnion,
 * it keeps ordering and is more performant). Recursively peels off the last member
 * using LastOf until the union is exhausted.
 */
export type UnionToTuple<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = N extends true
  ? []
  : [...UnionToTuple<Exclude<T, L>>, L & string]

/**
 * A utility used for XOR: marks every key that is only in T (and not in U)
 * as optional-never, effectively requiring those keys to be absent.
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

/**
 * Exclusive-or of two object types: produces a type that is either
 * (T without any U-specific keys) OR (U without any T-specific keys),
 * so only one of them may be present. For non-object unions it falls back to T | U.
 */
export type SingleXOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

/**
 * Extracts the element type of an array (e.g. ArrayType<string[]> === string).
 */
export type ArrayType<T> = T extends (infer U)[] ? U : never

/**
 * Exclusive-or across a tuple of many types: combines them pairwise with SingleXOR,
 * reducing the list until only one remains, ensuring exactly one is present.
 */
export type XOR<T extends unknown[]> = T extends [infer Only]
  ? Only
  : T extends [infer A, infer B, ...infer Rest]
    ? XOR<[SingleXOR<A, B>, ...Rest]>
    : never

/**
 * A tuple type that guarantees at least one element (no empty arrays allowed).
 */
export type NonEmptyArray<T> = [T, ...T[]]

/**
 * Recursively makes every nested property optional, including those inside arrays,
 * so deep structures can be partially provided.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends (infer U)[]
      ? DeepPartial<U>[]
      : T[P] extends object
        ? DeepPartial<T[P]>
        : T[P]
}

/**
 * A distributive version of `Omit` that preserves union types (including XOR patterns).
 *
 * The built-in `Omit<T, K>` does not reliably distribute over unions when the
 * mapped type is non-homomorphic, which breaks XOR constraints that rely on
 * `?: never` properties. This version forces distribution by using a conditional
 * type, ensuring each union member is processed independently.
 */
export type DistributiveOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never

/**
 * Enforces that at least one of the given keys is provided.
 */
export type AtLeastOne<T extends Record<string, unknown>> = {
  [K in keyof T]: { [P in K]: T[P] } & { [P in Exclude<keyof T, K>]?: T[P] }
}[keyof T]
