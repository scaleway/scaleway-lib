import { describe, expectTypeOf, it } from 'vitest'
import type { DistributiveOmit, XOR } from '../index'

describe('distributive omit', () => {
  it('omits a key from a single object type', () => {
    expectTypeOf<DistributiveOmit<{ a: string; b: number }, 'a'>>().toEqualTypeOf<{ b: number }>()
  })

  it('distributes over a union, omitting the key from each member', () => {
    expectTypeOf<DistributiveOmit<{ a: string; b: number } | { a: boolean; c: string }, 'a'>>().toEqualTypeOf<
      { b: number } | { c: string }
    >()
  })

  // The mapped-type body resolves eagerly even when the source is an XOR union
  // (an intersection of `Partial<Record<..., never>>` variants), so the omitted
  // type stays a concrete object instead of a deferred `Omit<...>` wrapper.
  // The deferred form is what trips `no-redundant-type-constituents` once the
  // omitted type is intersected again (e.g. `& { to: string }`) downstream —
  // the real-world trigger is `ComponentProps<typeof Link>` from `@ultraviolet/ui`,
  // whose `ForwardRefExoticComponent<DistributiveOmit<P, K> & {...}>` path keeps
  // `Omit` deferred. That path needs React types and lives in @ultraviolet/ui.
  it('resolves to a concrete object when omitting from an XOR union', () => {
    type LinkProps = XOR<[{ href: string; to?: never }, { to: string; href?: never }]>
    type Omitted = DistributiveOmit<LinkProps, 'to'>

    // `href` survives the omit as a known property; `to` is gone.
    expectTypeOf<Omitted>().toHaveProperty('href')
    expectTypeOf<Omitted>().not.toHaveProperty('to')
  })

  // The XOR exclusivity invariant must survive the omit: after removing `to`
  // and re-adding it via intersection, the result is a concrete object requiring
  // `to` — not a collapsed `any`. This is the behavior `@ultraviolet/ui`'s Link
  // relies on (the deferred `Omit` form is what `no-redundant-type-constituents`
  // flags downstream).
  it('preserves the XOR invariant after omitting one branch key', () => {
    type LinkProps = XOR<[{ href: string; to?: never }, { to: string; href?: never }]>
    type Omitted = DistributiveOmit<LinkProps, 'to'> & { to: string }

    // The intersection did NOT collapse to `any`: `to` is a required key, so a
    // value missing it must not be assignable.
    expectTypeOf<{ href: string }>().not.toExtend<Omitted>()
    expectTypeOf<{ href: string; to: string }>().toExtend<Omitted>()
  })
})
