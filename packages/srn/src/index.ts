/**
 * Scaleway Resource Name (SRN) parser and stringifier.
 *
 * This is a TypeScript port of the SRN parser originally written in Go.
 *  The parsing logic, regex patterns,
 * and segment-walking algorithm mirror the Go implementation, adapted to the
 * idioms of TypeScript (readonly object literals instead of structs, linked
 * list via closures instead of pointer fields).
 *
 * An SRN follows the format:
 *
 *   srn://<product>.<platformDomain>/[zones|regions/<name>/]<resourcePath>
 *
 * Examples:
 *   srn://block.scw.eu/zones/it-mil-1/snapshots/22222222-...
 *   srn://iam.scw.cloud/regions/fr-par-1/users/11111111-...
 *   srn://api.scw.cloud//ips          (global locality, empty locality prefix)
 *
 * The resource path is walked as key/value pairs (e.g. `snapshots/<id>`).
 * A trailing segment with no value is treated as a singleton segment
 * (e.g. `ips` in `...//ips`).
 *
 * @see https://github.com/scaleway/scaleway-sdk-go  (Go parser of reference)
 */

import type { ApiLocality, Region, Zone } from '@scaleway/sdk-client'

/**
 * The locality scope of a Scaleway resource, derived from `@scaleway/sdk-client`'s
 * `ApiLocality` type:
 *
 * - `zone`   — a single availability zone (e.g. `it-mil-1`)
 * - `region` — a geographical region containing one or more zones (e.g. `fr-par`)
 * - `global` — not scoped to a zone or region (e.g. IAM resources)
 *
 * The SDK's `'unspecified'` scope is excluded: an SRN locality is always a
 * zone, a region, or global.
 */
export type LocalityType = Exclude<ApiLocality['type'], 'unspecified'>

/**
 * A Scaleway locality identifier — the `name` part of a {@link Locality}.
 *
 * Sourced from `@scaleway/sdk-client`, which is the single source of truth for
 * Scaleway zones and regions: `Zone | Region`, plus `''` for global
 * localities. The SDK's `Zone` and `Region` unions are open
 * (`'fr-par-1' | … | string`), so any string is assignable — a locality name
 * that ships after this package's release stays representable at the type
 * level without extending anything.
 *
 * Consumers that maintain their own narrower union of locality names
 * (e.g. a console that only handles `'fr-par-1' | 'fr-par-2'`) can pass that
 * union as the `L` generic parameter of {@link SRN} / {@link parseSRN} /
 * {@link safeParseSRN}, because every member of the narrower union is also a
 * member of this one.
 */
export type LocalityName = Zone | Region | ''

/**
 * A locality prefix extracted from the SRN path.
 *
 * `type` indicates whether the resource is scoped to a zone, a region, or
 * is global. `name` is the zone/region identifier (empty when `type` is `global`).
 *
 * @template L — the locality-name union a consumer wants to narrow `name` to.
 *   Defaults to {@link LocalityName}, the open union of every Scaleway zone,
 *   region, and `''` (global) sourced from `@scaleway/sdk-client`. A console
 *   that only handles a subset can substitute its own union (e.g.
 *   `'fr-par-1' | 'fr-par-2'`); every member of the narrower union is also a
 *   member of `LocalityName`.
 */
export type Locality<L extends LocalityName = LocalityName> = {
  readonly name: L
  readonly type: LocalityType
}

/**
 * A single key/value segment in the resource identifier chain.
 *
 * Segments form a singly-linked list via `parent`, allowing traversal from
 * any segment back to the root. Each segment represents one level of the
 * resource path (e.g. `snapshots -> 22222222`).
 *
 * For `srn://block.scw.eu/zones/it-mil-1/snapshots/22222222`:
 *   root segment: { name: 'snapshots', value: '22222222', parent: null }
 *
 * For deeper paths like `srn://.../instances/111/disks/222`:
 *   root segment: { name: 'instances', value: '111', parent: null }
 *   child segment: { name: 'disks', value: '222', parent: <root> }
 *
 * @template R — the resource-type key union a consumer wants to narrow `name`
 *   to. Defaults to `string`, so the parser accepts any input. A console that
 *   knows the set of resource types for a product can substitute its own union
 *   (e.g. `'snapshots' | 'disks' | 'users'`); every segment in the chain then
 *   carries that narrowed type. The union should cover every key that can
 *   appear in a single SRN's path, since segments are heterogeneous
 *   (e.g. `instances/111/disks/222` mixes `instances` and `disks`).
 */
export type ResourceIdentifierSegment<R extends string = string> = {
  /** The resource type key (e.g. `snapshots`, `disks`, `users`). */
  readonly name: R
  /** The resource identifier value (e.g. a UUID). */
  readonly value: string
  /** The parent segment, or `null` if this is the root of the chain. */
  readonly parent: ResourceIdentifierSegment<R> | null
  /** Returns the root segment of the chain (walks `parent` until `null`). */
  readonly root: () => ResourceIdentifierSegment<R>
  /** Returns `true` if this segment is the root (has no parent). */
  readonly isRoot: () => boolean
}

/**
 * A parsed Scaleway Resource Name.
 *
 * Produced by {@link parseSRN} and consumed by {@link stringifySRN}.
 * Use `toString()` to serialize back to the canonical SRN string form.
 *
 * @template P — the product-name union a consumer wants to narrow `product`
 *   to. Defaults to `string`, so {@link parseSRN} accepts any input without
 *   the library having to enumerate Scaleway's product catalog (which is
 *   large, fast-moving, and partly internal). A console that knows the set
 *   of products it handles can substitute its own union
 *   (e.g. `'block' | 'iam' | 'k8s'`).
 * @template R — the resource-type-key union for `resourceIdentifier` segment
 *   names. Defaults to `string`; see {@link ResourceIdentifierSegment}.
 * @template L — the locality-name union for `locality.name`. Defaults to
 *   {@link LocalityName}, the open union of every Scaleway zone, region, and
 *   `''` (global) sourced from `@scaleway/sdk-client`. A console that only
 *   handles a subset can substitute its own union (e.g. `'fr-par-1' |
 *   'fr-par-2'`); see {@link Locality}.
 */
export type SRN<P extends string = string, R extends string = string, L extends LocalityName = LocalityName> = {
  /** The product namespace (e.g. `block`, `iam`, `api`). */
  readonly product: P
  /** The platform domain (e.g. `scw.eu`, `scw.cloud`). */
  readonly platformDomain: string
  /** The locality (zone, region, or global) the resource belongs to. */
  readonly locality: Locality<L>
  /** The raw resource path after the locality prefix (e.g. `snapshots/22222222`). */
  readonly resourcePath: string
  /**
   * The root of the resource identifier segment chain, or `null` if the path
   * has no key/value pairs (e.g. a singleton-only or empty path).
   */
  readonly resourceIdentifier: ResourceIdentifierSegment<R> | null
  /**
   * The trailing singleton segment when the path ends with a key that has no
   * paired value (e.g. `ips` in `srn://...//ips`). Empty string if absent.
   */
  readonly singletonSegment: string
  /** Serializes this SRN back to its canonical string form. */
  readonly toString: () => string
}

// Matches the full SRN: srn://<product>.<platformDomain>/<path>
// The `s` flag allows `.` to match newlines; `v` enables named-group mode.
const SRN_RE = /^srn:\/\/(?<product>[^.]+)\.(?<platform>[^\/]+)\/(?<path>.*)$/sv

// Matches an optional locality prefix: <zones|regions>/<name>/
const LOCALITY_RE = /^(?<loc>[^\/]+)\/(?<locName>[^\/]+)\//v

/**
 * Error thrown when an SRN string cannot be parsed.
 */
export class SRNParseError extends Error {
  public constructor(message: string) {
    super(message)
    this.name = 'SRNParseError'
  }
}

/**
 * Successful result of {@link safeParseSRN}. Carries the parsed {@link SRN}
 * as `data`, mirroring zod's `safeParse` return shape so it destructures the
 * same way in render code.
 *
 * @template P, R, L — forwarded to {@link SRN}; see {@link parseSRN}.
 */
export type SafeParseSuccess<
  P extends string = string,
  R extends string = string,
  L extends LocalityName = LocalityName,
> = {
  readonly success: true
  readonly data: SRN<P, R, L>
}

/**
 * Failed result of {@link safeParseSRN}. Carries the {@link SRNParseError}
 * as `error`, mirroring zod's `safeParse` return shape.
 */
export type SafeParseError = {
  readonly success: false
  readonly error: SRNParseError
}

/**
 * The discriminated union returned by {@link safeParseSRN}.
 *
 * Narrow on `success` in render code without a try/catch:
 *
 * @example
 * const result = safeParseSRN(maybeSrn)
 * if (result.success) {
 *   return <Detail srn={result.data} />
 * }
 * return <ErrorView error={result.error} />
 *
 * @template P, R, L — forwarded to {@link SRN}; see {@link parseSRN}.
 */
export type SafeParseResult<
  P extends string = string,
  R extends string = string,
  L extends LocalityName = LocalityName,
> = SafeParseSuccess<P, R, L> | SafeParseError

/**
 * Builds the locality prefix string for a given locality type and name.
 *
 * - `zone`   → `zones/<name>`
 * - `region` → `regions/<name>`
 * - `global` → `''` (no prefix)
 */
const localityPrefix = (type: LocalityType, name: LocalityName): string => {
  switch (type) {
    case 'zone': {
      return `zones/${name}`
    }
    case 'region': {
      return `regions/${name}`
    }
    case 'global': {
      return ''
    }
    default: {
      return ''
    }
  }
}

/**
 * Creates a linked-list node for the resource identifier chain.
 *
 * Each segment is linked to its `parent`, and provides `root()` / `isRoot()`
 * helpers for traversing the chain back to the top-level resource.
 */
const makeSegment = <R extends string>(
  name: R,
  value: string,
  parent: ResourceIdentifierSegment<R> | null,
): ResourceIdentifierSegment<R> => ({
  name,
  value,
  parent,
  isRoot: () => parent === null,
  root(): ResourceIdentifierSegment<R> {
    return this.parent === null ? this : this.parent.root()
  },
})

/**
 * Serializes an {@link SRN} object back into its canonical string form.
 *
 * Returns `'undefined'` if both `product` and `platformDomain` are empty.
 */
export const stringifySRN = <P extends string, R extends string, L extends LocalityName>(srn: SRN<P, R, L>): string => {
  if (!srn.product && !srn.platformDomain) {
    return ''
  }
  const parts: string[] = []
  const prefix = localityPrefix(srn.locality.type, srn.locality.name)
  if (prefix !== '') {
    parts.push(prefix)
  }
  parts.push(srn.resourcePath)
  return `srn://${srn.product}.${srn.platformDomain}/${parts.join('/')}`
}

/**
 * Parses an SRN string into a structured {@link SRN} object.
 *
 * The input must match the pattern `srn://<product>.<platformDomain>/<path>`.
 * The platform domain must contain at least one dot (`.`).
 *
 * The path is split into an optional locality prefix (`zones/<name>/` or
 * `regions/<name>/`) and a resource path. The resource path is walked in
 * key/value pairs to build the resource identifier segment chain. A trailing
 * segment without a value is captured as a `singletonSegment`.
 *
 * @throws {SRNParseError} if the input does not match the SRN format or
 *   the platform domain is invalid.
 *
 * @template P — the product-name union a consumer wants to narrow `product`
 *   to. Defaults to `string`. The parser cannot verify the union at runtime;
 *   passing a narrower union is an assertion by the caller that the input
 *   will only carry those products.
 * @template R — the resource-type-key union for `resourceIdentifier` segment
 *   names. Defaults to `string`; same caveat as `P`.
 * @template L — the locality-name union for `locality.name`. Defaults to
 *   {@link LocalityName}. Same caveat as `P`.
 *
 * @example
 * const srn = parseSRN('srn://block.scw.eu/zones/it-mil-1/snapshots/22222222')
 * // srn.product             // 'block'
 * // srn.platformDomain      // 'scw.eu'
 * // srn.locality            // { name: 'it-mil-1', type: 'zone' }
 * // srn.resourcePath        // 'snapshots/22222222'
 * // srn.resourceIdentifier  // { name: 'snapshots', value: '22222222', parent: null, ... }
 * // srn.singletonSegment    // ''
 * // srn.toString()          // 'srn://block.scw.eu/zones/it-mil-1/snapshots/22222222'
 *
 * @example Narrowing at the parse boundary
 * const srn = parseSRN<'block', 'snapshots', 'it-mil-1'>(input)
 * // srn.product: 'block', srn.resourceIdentifier?.name: 'snapshots',
 * // srn.locality.name: 'it-mil-1'
 */
export const parseSRN = <P extends string = string, R extends string = string, L extends LocalityName = LocalityName>(
  input: string,
): SRN<P, R, L> => {
  const m = SRN_RE.exec(input)
  const groups = m?.groups
  if (!groups) {
    throw new SRNParseError('parse: cannot break down the provided uri')
  }

  const { product, platform, path } = groups
  if (product === undefined || platform === undefined || path === undefined) {
    throw new SRNParseError('parse: cannot break down the provided uri')
  }

  if (!platform.includes('.')) {
    throw new SRNParseError('parse: cannot extract a platform domain')
  }

  let locType: LocalityType = 'global'
  let locName = ''

  const lm = LOCALITY_RE.exec(path)
  const lmGroups = lm?.groups
  const loc = lmGroups?.['loc']
  if (loc !== undefined) {
    locName = lmGroups?.['locName'] ?? ''
    if (loc === 'zones') {
      locType = 'zone'
    } else if (loc === 'regions') {
      locType = 'region'
    }
  }
  const resourcePath = loc !== undefined ? path.slice(lm?.[0].length ?? 0) : path.replace(/^\/\//v, '')

  const segments = resourcePath.split('/')
  let resourceIdentifier: ResourceIdentifierSegment<R> | null = null
  let singletonSegment = ''

  for (let i = 0; i < segments.length; i += 2) {
    const key = segments[i]
    if (key === undefined || key === '') {
      break
    }
    const value: string | undefined = segments[i + 1]
    if (value === undefined || value === '') {
      singletonSegment = key
      break
    }
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- parser: the caller asserts R via the generic; runtime values come from arbitrary input
    resourceIdentifier = makeSegment<R>(key as R, value, resourceIdentifier)
  }

  // Parsed from arbitrary SRN input; cast to L. The caller asserts L via the
  // generic; unknown future localities parse at runtime but may not be in L.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- intentional: see comment above
  const locality: Locality<L> = { name: locName as L, type: locType }

  return {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- parser: the caller asserts P via the generic
    product: product as P,
    platformDomain: platform,
    locality,
    resourcePath,
    resourceIdentifier,
    singletonSegment,
    toString(): string {
      return stringifySRN(this)
    },
  }
}

/**
 * Parses an SRN string without throwing, returning a zod-style discriminated
 * union instead.
 *
 * Useful in React render code where try/catch is awkward (no conditional
 * hooks, no throwing in `useMemo`). Narrow on `result.success`:
 *
 * @template P, R, L — forwarded to {@link parseSRN}; the caller asserts the
 *   input will only carry those products / resource keys / localities. The
 *   returned `data` on the success branch is `SRN<P, R, L>`.
 *
 * @example
 * const result = safeParseSRN(input)
 * if (result.success) {
 *   console.log(result.data.locality.name)
 * } else {
 *   console.error(result.error.message)
 * }
 *
 * @example Narrowing at the parse boundary
 * const result = safeParseSRN<'block', 'snapshots', 'it-mil-1'>(input)
 * if (result.success) {
 *   // result.data.product: 'block'
 *   // result.data.locality.name: 'it-mil-1'
 * }
 *
 * @see parseSRN for the throwing variant.
 */
export const safeParseSRN = <
  P extends string = string,
  R extends string = string,
  L extends LocalityName = LocalityName,
>(
  input: string,
): SafeParseResult<P, R, L> => {
  try {
    return { success: true, data: parseSRN<P, R, L>(input) }
  } catch (error) {
    // Never throw — that's the whole point of safeParse. SRNParseError passes
    // through; any unexpected error is wrapped so the error branch always
    // carries an SRNParseError and the type contract stays honest.
    if (error instanceof SRNParseError) {
      return { success: false, error }
    }
    return {
      success: false,
      error: new SRNParseError(error instanceof Error ? error.message : 'parse: unknown error'),
    }
  }
}
