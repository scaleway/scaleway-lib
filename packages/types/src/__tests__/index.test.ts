import { describe, expect, it } from 'vitest'
import type {
  ArrayType,
  DeepPartial,
  LastOf,
  NonEmptyArray,
  SingleXOR,
  TupleUnion,
  UnionToIntersection,
  UnionToTuple,
  Without,
  XOR,
} from '../index'

// `[A] extends [B]` (non-distributive) so it also works when `A` is `never`.
type IsSubtypeOf<A, B> = [A] extends [B] ? true : never

describe('tupleUnion', () => {
  it('converts a single-member union to a one-element tuple', () => {
    const check: IsSubtypeOf<TupleUnion<'a'>, ['a']> = true
    expect(check).toBe(true)
  })

  it('converts a two-member union to a tuple of permutations', () => {
    type T = TupleUnion<'a' | 'b'>
    const check: IsSubtypeOf<T, ['a', 'b'] | ['b', 'a']> = true
    expect(check).toBe(true)
  })

  it('produces string arrays for any union size', () => {
    type T = TupleUnion<'a' | 'b' | 'c'>
    const check: IsSubtypeOf<T, string[]> = true
    expect(check).toBe(true)
  })
})

describe('unionToIntersection', () => {
  it('intersects two object unions', () => {
    type T = UnionToIntersection<{ a: string } | { b: number }>
    const check: IsSubtypeOf<T, { a: string } & { b: number }> = true
    expect(check).toBe(true)
  })

  it('intersects three object unions', () => {
    type T = UnionToIntersection<{ a: string } | { b: number } | { c: boolean }>
    const check: IsSubtypeOf<T, { a: string; b: number; c: boolean }> = true
    expect(check).toBe(true)
  })

  it('works with primitive unions (intersects to never)', () => {
    type T = UnionToIntersection<string | number>
    const check: IsSubtypeOf<T, string & number> = true
    expect(check).toBe(true)
  })
})

describe('lastOf', () => {
  it('returns the last member of a string union', () => {
    type T = LastOf<'a' | 'b' | 'c'>
    const check: IsSubtypeOf<T, 'a' | 'b' | 'c'> = true
    expect(check).toBe(true)
  })

  it('returns the single member of a one-member union', () => {
    type T = LastOf<'only'>
    const check: IsSubtypeOf<T, 'only'> = true
    expect(check).toBe(true)
  })
})

describe('unionToTuple', () => {
  it('converts a two-member union to a tuple of strings', () => {
    type T = UnionToTuple<'a' | 'b'>
    const check: IsSubtypeOf<T, ['a', 'b'] | ['b', 'a']> = true
    expect(check).toBe(true)
  })

  it('converts a three-member union to a 3-element tuple', () => {
    type T = UnionToTuple<'a' | 'b' | 'c'>
    const valid: T = ['a', 'b', 'c']
    expect(valid).toHaveLength(3)
  })

  it('produces an empty tuple for never', () => {
    type T = UnionToTuple<never>
    const check: IsSubtypeOf<T, []> = true
    expect(check).toBe(true)
  })
})

describe('without', () => {
  it('marks keys in T but not in U as never', () => {
    type T = Without<{ a: string; b: number }, { a: string }>
    const check: IsSubtypeOf<T, { b?: number }> = true
    expect(check).toBe(true)
  })

  it('produces an empty type when T and U share all keys', () => {
    type T = Without<{ a: string }, { a: string; b: number }>
    const check: IsSubtypeOf<T, Record<string, never>> = true
    expect(check).toBe(true)
  })
})

describe('singleXOR', () => {
  it('allows only the first object type', () => {
    type A = { type: 'a'; value: string }
    type B = { type: 'b'; count: number }
    type T = SingleXOR<A, B>
    const valid: T = { type: 'a', value: 'x' }
    expect(valid).toStrictEqual({ type: 'a', value: 'x' })
  })

  it('allows only the second object type', () => {
    type A = { type: 'a'; value: string }
    type B = { type: 'b'; count: number }
    type T = SingleXOR<A, B>
    const valid: T = { type: 'b', count: 1 }
    expect(valid).toStrictEqual({ type: 'b', count: 1 })
  })

  it('rejects an object mixing both types', () => {
    type A = { type: 'a'; value: string }
    type B = { type: 'b'; count: number }
    type T = SingleXOR<A, B>
    // @ts-expect-error - cannot have properties from both types
    const invalid: T = { type: 'a', value: 'x', count: 1 }
    expect(invalid).toBeDefined()
  })

  it('returns a plain union for primitives', () => {
    const check: IsSubtypeOf<SingleXOR<string, number>, string | number> = true
    expect(check).toBe(true)
  })
})

describe('arrayType', () => {
  it('extracts the element type of a string array', () => {
    const check: IsSubtypeOf<ArrayType<string[]>, string> = true
    expect(check).toBe(true)
  })

  it('extracts the element type of a number array', () => {
    const check: IsSubtypeOf<ArrayType<number[]>, number> = true
    expect(check).toBe(true)
  })

  it('extracts the element type of an object array', () => {
    const check: IsSubtypeOf<ArrayType<{ id: string }[]>, { id: string }> = true
    expect(check).toBe(true)
  })

  it('returns never for a non-array type', () => {
    const check: IsSubtypeOf<ArrayType<string>, never> = true
    expect(check).toBe(true)
  })
})

describe('xor', () => {
  it('returns the single type when given a one-element tuple', () => {
    const check: IsSubtypeOf<XOR<[{ a: string }]>, { a: string }> = true
    expect(check).toBe(true)
  })

  it('allows exactly one of two object types (first)', () => {
    type T = XOR<[{ type: 'a' }, { type: 'b' }]>
    const valid: T = { type: 'a' }
    expect(valid).toStrictEqual({ type: 'a' })
  })

  it('allows exactly one of two object types (second)', () => {
    type T = XOR<[{ type: 'a' }, { type: 'b' }]>
    const valid: T = { type: 'b' }
    expect(valid).toStrictEqual({ type: 'b' })
  })

  it('allows exactly one of three object types', () => {
    type T = XOR<[{ type: 'a' }, { type: 'b' }, { type: 'c' }]>
    const valid: T = { type: 'c' }
    expect(valid).toStrictEqual({ type: 'c' })
  })

  it('rejects an object with extra properties from another type', () => {
    type T = XOR<[{ type: 'a'; value: string }, { type: 'b'; count: number }]>
    // @ts-expect-error - cannot have properties from both types
    const invalid: T = { type: 'a', value: 'x', count: 1 }
    expect(invalid).toBeDefined()
  })
})

describe('nonEmptyArray', () => {
  it('accepts a single-element array', () => {
    const check: IsSubtypeOf<NonEmptyArray<string>, [string, ...string[]]> = true
    expect(check).toBe(true)
  })

  it('accepts a multi-element array', () => {
    const arr: NonEmptyArray<number> = [1, 2, 3]
    expect(arr).toHaveLength(3)
  })

  it('rejects an empty array', () => {
    // @ts-expect-error - empty array is not assignable to NonEmptyArray
    const arr: NonEmptyArray<number> = []
    expect(arr).toHaveLength(0)
  })
})

describe('deepPartial', () => {
  it('makes top-level properties optional', () => {
    type T = DeepPartial<{ a: string; b: number }>
    const check: IsSubtypeOf<T, { a?: string; b?: number }> = true
    expect(check).toBe(true)
  })

  it('makes nested object properties optional recursively', () => {
    type T = DeepPartial<{ nested: { inner: string } }>
    const check: IsSubtypeOf<T, { nested?: { inner?: string } }> = true
    expect(check).toBe(true)
  })

  it('makes array of objects partially optional', () => {
    type T = DeepPartial<{ list: { id: number }[] }>
    const check: IsSubtypeOf<T, { list?: { id?: number }[] }> = true
    expect(check).toBe(true)
  })

  it('allows an empty object for a deeply nested type', () => {
    type T = DeepPartial<{ a: string; nested: { b: number }; list: string[] }>
    const valid: T = {}
    expect(valid).toStrictEqual({})
  })

  it('allows partial nested values', () => {
    type T = DeepPartial<{ nested: { b: number; c: string } }>
    const valid: T = { nested: { b: 1 } }
    expect(valid).toStrictEqual({ nested: { b: 1 } })
  })

  it('allows partial array items', () => {
    type T = DeepPartial<{ list: { id: number; name: string }[] }>
    const valid: T = { list: [{ id: 1 }] }
    expect(valid).toStrictEqual({ list: [{ id: 1 }] })
  })
})
