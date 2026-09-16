---
'@scaleway/types': patch
---

Fix `DistributiveOmit` staying deferred through `ForwardRefExoticComponent` / `ComponentProps` inference.

Replace the `Omit<T, K>` body with an inline homomorphic mapped type
`{ [P in Exclude<keyof T, K>]: T[P] }`. When `T` is an unresolved conditional
or intersection (e.g. an `XOR` union), `Omit<T, K>` stays deferred through later
inference and intersections, which trips `no-redundant-type-constituents`
downstream — the real-world trigger being `ComponentProps<typeof Link>` from
`@ultraviolet/ui`, whose `ForwardRefExoticComponent<DistributiveOmit<P, K> & {...}>`
path kept the `Omit` wrapper deferred. The inline mapped type resolves eagerly.

Note: the wide `K extends string | number | symbol` constraint is preserved;
`Exclude<keyof T, K>` makes keys not in `T` no-ops, so it remains safe.
