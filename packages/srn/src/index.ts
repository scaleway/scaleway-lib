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

import { parseSRNWide, SRNParseError, stringifySRN, walkSegments } from './internal'
import type { LocalityName, SafeParseResult, SRN, SRNGuards } from './internal'

export { SRNParseError, stringifySRN } from './internal'
export type {
  Locality,
  LocalityName,
  LocalityType,
  ResourceIdentifierSegment,
  SafeParseError,
  SafeParseResult,
  SafeParseSuccess,
  SRN,
  SRNGuards,
} from './internal'

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
 * Two overloads:
 *
 * - `parseSRN(input)` returns the wide `SRN`, where `product`,
 *   `resourceIdentifier.name` and `locality.name` are `string` /
 *   {@link LocalityName}. No guard required.
 * - `parseSRN(input, guards)` narrows `P`/`R`/`L` through the provided
 *   runtime type guards ({@link SRNGuards}). The generic parameters are
 *   inferred from the guards, so a narrower union is only ever produced by a
 *   guard that verifies it at runtime — the parser performs no unsafe type
 *   assertion.
 *
 * @throws {SRNParseError} if the input does not match the SRN format, the
 *   platform domain is invalid, or a provided guard rejects a parsed value.
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
 * @example Narrowing through runtime guards
 * const srn = parseSRN('srn://block.scw.eu/zones/it-mil-1/snapshots/22222222', {
 *   isProduct: (v): v is 'block' => v === 'block',
 *   isResource: (v): v is 'snapshots' => v === 'snapshots',
 *   isLocality: (v): v is 'it-mil-1' => v === 'it-mil-1',
 * })
 * // srn.product: 'block', srn.resourceIdentifier?.name: 'snapshots',
 * // srn.locality.name: 'it-mil-1'
 */
export function parseSRN(input: string): SRN
export function parseSRN<P extends string, R extends string, L extends LocalityName>(
  input: string,
  guards: SRNGuards<P, R, L>,
): SRN<P, R, L>
export function parseSRN<P extends string, R extends string, L extends LocalityName>(
  input: string,
  guards?: SRNGuards<P, R, L>,
): SRN | SRN<P, R, L> {
  const wide = parseSRNWide(input)
  if (guards === undefined) {
    return wide
  }

  if (!guards.isProduct(wide.product)) {
    throw new SRNParseError(`parse: product '${wide.product}' is not allowed by the provided guard`)
  }
  if (!guards.isLocality(wide.locality.name)) {
    throw new SRNParseError(`parse: locality '${wide.locality.name}' is not allowed by the provided guard`)
  }
  const { resourceIdentifier, singletonSegment } = walkSegments(wide.resourcePath, guards.isResource)

  return {
    product: wide.product,
    platformDomain: wide.platformDomain,
    locality: { name: wide.locality.name, type: wide.locality.type },
    resourcePath: wide.resourcePath,
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
 * Two overloads mirroring {@link parseSRN}:
 *
 * - `safeParseSRN(input)` returns the wide `SafeParseResult` (no guards).
 * - `safeParseSRN(input, guards)` narrows the success `data` through the
 *   provided runtime type guards ({@link SRNGuards}).
 *
 * @example
 * const result = safeParseSRN(input)
 * if (result.success) {
 *   console.log(result.data.locality.name)
 * } else {
 *   console.error(result.error.message)
 * }
 *
 * @example Narrowing through runtime guards
 * const result = safeParseSRN('srn://block.scw.eu/zones/it-mil-1/snapshots/22222222', {
 *   isProduct: (v): v is 'block' => v === 'block',
 *   isResource: (v): v is 'snapshots' => v === 'snapshots',
 *   isLocality: (v): v is 'it-mil-1' => v === 'it-mil-1',
 * })
 * if (result.success) {
 *   // result.data.product: 'block'
 *   // result.data.locality.name: 'it-mil-1'
 * }
 *
 * @see parseSRN for the throwing variant.
 */
export function safeParseSRN(input: string): SafeParseResult
export function safeParseSRN<P extends string, R extends string, L extends LocalityName>(
  input: string,
  guards: SRNGuards<P, R, L>,
): SafeParseResult<P, R, L>

export function safeParseSRN<P extends string, R extends string, L extends LocalityName>(
  input: string,
  guards?: SRNGuards<P, R, L>,
): SafeParseResult | SafeParseResult<P, R, L> {
  try {
    if (guards === undefined) {
      return { success: true, data: parseSRN(input) }
    }
    return { success: true, data: parseSRN(input, guards) }
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
