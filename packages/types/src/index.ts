export type TupleUnion<U extends string, R extends string[] = []> = {
  [S in U]: Exclude<U, S> extends never ? [...R, S] : TupleUnion<Exclude<U, S>, [...R, S]>
}[U]

// TupleUnion performs too many recursion for typescript's liking.
// So we use a custom type which is a bit more performant by keeping ordering
// This type is intended to be used when TupleUnion breaks
export type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void
  ? I
  : never
export type LastOf<T> = UnionToIntersection<T extends unknown ? () => T : never> extends () => infer R ? R : never
export type UnionToTuple<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = N extends true
  ? []
  : [...UnionToTuple<Exclude<T, L>>, L & string]

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
export type SingleXOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

export type ArrayType<T> = T extends (infer U)[] ? U : never

export type XOR<T extends unknown[]> = T extends [infer Only]
  ? Only
  : T extends [infer A, infer B, ...infer Rest]
    ? XOR<[SingleXOR<A, B>, ...Rest]>
    : never

export type NonEmptyArray<T> = [T, ...T[]]

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends (infer U)[]
      ? DeepPartial<U>[]
      : T[P] extends object
        ? DeepPartial<T[P]>
        : T[P]
}
