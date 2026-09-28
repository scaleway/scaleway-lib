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

/**
 * The locality scope of a Scaleway resource.
 *
 * - `zone`   — a single availability zone (e.g. `it-mil-1`)
 * - `region` — a geographical region containing one or more zones (e.g. `fr-par`)
 * - `global` — not scoped to a zone or region (e.g. IAM resources)
 */
export type LocalityType = 'zone' | 'region' | 'global'

/**
 * A Scaleway locality identifier — the `name` part of a {@link Locality}.
 *
 * This is the closed set of locality names that Scaleway currently operates,
 * mirrored from `scaleway-sdk-go` `scw/locality.go`. It is the union of every
 * known zone, every known region, and the empty string (used when the
 * locality type is `global`).
 *
 * Consumers that maintain their own narrower union of locality names
 * (e.g. a console that only handles `'fr-par-1' | 'fr-par-2'`) can pass that
 * union anywhere a `LocalityName` is expected, because every member of the
 * narrower union is also a member of this one.
 *
 * Note: `parseSRN` returns this broad type for any input that parses. An SRN
 * carrying a locality name not yet in this list still parses at runtime but is
 * not representable at the type level — extend this union when Scaleway ships a
 * new zone or region.
 */
export type LocalityName =
  // Zones
  | 'fr-par-1'
  | 'fr-par-2'
  | 'fr-par-3'
  | 'nl-ams-1'
  | 'nl-ams-2'
  | 'nl-ams-3'
  | 'pl-waw-1'
  | 'pl-waw-2'
  | 'pl-waw-3'
  | 'it-mil-1'
  // Regions
  | 'fr-par'
  | 'nl-ams'
  | 'pl-waw'
  | 'it-mil'
  // Global (no locality prefix)
  | ''

/**
 * A locality prefix extracted from the SRN path.
 *
 * `type` indicates whether the resource is scoped to a zone, a region, or
 * is global. `name` is the zone/region identifier (empty when `type` is `global`).
 */
export type Locality = {
  readonly name: LocalityName
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
 */
export type SRN<P extends string = string, R extends string = string> = {
  /** The product namespace (e.g. `block`, `iam`, `api`). */
  readonly product: P
  /** The platform domain (e.g. `scw.eu`, `scw.cloud`). */
  readonly platformDomain: string
  /** The locality (zone, region, or global) the resource belongs to. */
  readonly locality: Locality
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
 */
export type SafeParseSuccess = {
  readonly success: true
  readonly data: SRN
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
 */
export type SafeParseResult = SafeParseSuccess | SafeParseError

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
export const stringifySRN = <P extends string, R extends string>(srn: SRN<P, R>): string => {
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
 * @example
 * const srn = parseSRN('srn://block.scw.eu/zones/it-mil-1/snapshots/22222222')
 * // srn.product             // 'block'
 * // srn.platformDomain      // 'scw.eu'
 * // srn.locality            // { name: 'it-mil-1', type: 'zone' }
 * // srn.resourcePath        // 'snapshots/22222222'
 * // srn.resourceIdentifier  // { name: 'snapshots', value: '22222222', parent: null, ... }
 * // srn.singletonSegment    // ''
 * // srn.toString()          // 'srn://block.scw.eu/zones/it-mil-1/snapshots/22222222'
 */
export const parseSRN = (input: string): SRN => {
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
  let resourceIdentifier: ResourceIdentifierSegment | null = null
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
    resourceIdentifier = makeSegment<string>(key, value, resourceIdentifier)
  }

  // Parsed from arbitrary SRN input; cast to LocalityName. Unknown future
  // localities parse at runtime but are not representable in the union.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- intentional: see comment above
  const locality: Locality = { name: locName as LocalityName, type: locType }

  return {
    product,
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
 * @example
 * const result = safeParseSRN(input)
 * if (result.success) {
 *   console.log(result.data.locality.name)
 * } else {
 *   console.error(result.error.message)
 * }
 *
 * @see parseSRN for the throwing variant.
 */
export const safeParseSRN = (input: string): SafeParseResult => {
  try {
    return { success: true, data: parseSRN(input) }
  } catch (error) {
    if (error instanceof SRNParseError) {
      return { success: false, error }
    }
    // Re-throw unknown errors; only SRNParseError is part of the API contract.
    throw error
  }
}
