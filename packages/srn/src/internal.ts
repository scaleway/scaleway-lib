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
 * Runtime guard functions used to narrow a parsed {@link SRN} to the
 * caller-supplied unions `P`/`R`/`L` via real type guards.
 *
 * The parser is kept free of unsafe `as` type assertions by delegating
 * narrowing to these caller-provided predicates: each is a genuine type
 * guard, so TypeScript narrows the parsed `string` values through it and no
 * assertion is needed.
 *
 * All three guards are required when narrowing. A consumer that only wants to
 * narrow part of the SRN should keep the remaining fields wide (use the
 * no-guard overload of {@link parseSRN} / {@link safeParseSRN}) and narrow at
 * the point of use.
 *
 * @template P — the product-name union; {@link parseSRN}'s `P`.
 * @template R — the resource-type-key union; {@link parseSRN}'s `R`.
 * @template L — the locality-name union; {@link parseSRN}'s `L`.
 */
export type SRNGuards<P extends string, R extends string, L extends LocalityName> = {
  /** Returns `true` when `value` is a product in `P`. */
  readonly isProduct: (value: string) => value is P
  /** Returns `true` when the resource-type key belongs to `R`. Applied to every key in the resource path. */
  readonly isResource: (value: string) => value is R
  /** Returns `true` when `value` is a locality name in `L`. */
  readonly isLocality: (value: string) => value is L
}

/**
 * Walks the resource path in key/value pairs, building the identifier chain.
 *
 * Each key must pass `isKey`; a rejected key throws an {@link SRNParseError}.
 * A trailing segment with no paired value is captured as the singleton
 * segment.
 */
export const walkSegments = <R extends string>(
  resourcePath: string,
  isKey: (key: string) => key is R,
): {
  readonly resourceIdentifier: ResourceIdentifierSegment<R> | null
  readonly singletonSegment: string
} => {
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
    if (!isKey(key)) {
      throw new SRNParseError(`parse: resource key '${key}' is not allowed by the provided guard`)
    }
    resourceIdentifier = makeSegment<R>(key, value, resourceIdentifier)
  }

  return { resourceIdentifier, singletonSegment }
}

/**
 * Parses an SRN string into the wide (un-narrowed) {@link SRN}, so no type
 * assertions are needed: every runtime value is a `string`, which the wide
 * `SRN` accepts directly.
 *
 * Public narrowing (see {@link parseSRN}) is applied separately via
 * {@link SRNGuards}; a parsed value never crosses a type assertion.
 */
export const parseSRNWide = (input: string): SRN => {
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

  const { resourceIdentifier, singletonSegment } = walkSegments(resourcePath, (_key): _key is string => true)

  return {
    product,
    platformDomain: platform,
    locality: { name: locName, type: locType },
    resourcePath,
    resourceIdentifier,
    singletonSegment,
    toString(): string {
      return stringifySRN(this)
    },
  }
}
