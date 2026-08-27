import type * as UtilityTypes from './index.js'

/**
 * Global augmentation entry.
 *
 * When this package is listed in `compilerOptions.types` of a `tsconfig.json`,
 * every utility type below becomes available in the global scope — no import needed.
 *
 * @example
 * tsconfig.json:
 * {
 *   "compilerOptions": {
 *     "types": ["@scaleway/utility-types/global"]
 *   }
 * }
 *
 * source.ts:
 * type T = UnionToTuple<'a' | 'b'> // no import required
 */
declare global {
  type TupleUnion<U extends string, R extends string[] = []> = UtilityTypes.TupleUnion<U, R>
  type UnionToIntersection<U> = UtilityTypes.UnionToIntersection<U>
  type LastOf<T> = UtilityTypes.LastOf<T>
  type UnionToTuple<T, L = UtilityTypes.LastOf<T>, N = [T] extends [never] ? true : false> = UtilityTypes.UnionToTuple<
    T,
    L,
    N
  >
  type Without<T, U> = UtilityTypes.Without<T, U>
  type SingleXOR<T, U> = UtilityTypes.SingleXOR<T, U>
  type ArrayType<T> = UtilityTypes.ArrayType<T>
  type XOR<T extends unknown[]> = UtilityTypes.XOR<T>
  type NonEmptyArray<T> = UtilityTypes.NonEmptyArray<T>
  type DeepPartial<T> = UtilityTypes.DeepPartial<T>
}

export {}
