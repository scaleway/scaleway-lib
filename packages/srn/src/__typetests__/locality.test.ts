import { describe, expect, expectTypeOf, it } from 'vitest'
import { parseSRN, safeParseSRN, stringifySRN } from '../index'
import type {
  Locality,
  LocalityName,
  LocalityType,
  ResourceIdentifierSegment,
  SafeParseError,
  SafeParseResult,
  SafeParseSuccess,
  SRN,
  SRNParseError,
} from '../index'

// A console-style narrower union of locality names. Every member must also be
// a member of LocalityName, so values of this type are assignable to it.
type ConsoleLocalityName = 'fr-par-1' | 'fr-par-2' | 'fr-par'

// A console-style narrower union of products the console handles. The library
// does not enumerate Scaleway's product catalog (large, fast-moving, partly
// internal); the console carries its own list and substitutes it via the
// generic parameter.
type ConsoleProduct = 'block' | 'iam' | 'k8s'

// A console-style narrower union of resource-type keys for the products above.
// Covers every key that can appear in a single SRN's path, since segments are
// heterogeneous (e.g. `instances/111/disks/222` mixes `instances` and `disks`).
type ConsoleResource = 'snapshots' | 'disks' | 'users' | 'clusters'

describe('srn - locality name', () => {
  it('accepts a narrower console union', () => {
    expectTypeOf<ConsoleLocalityName>().toExtend<LocalityName>()
  })

  it('accepts arbitrary strings — LocalityName is the open Zone | Region union from @scaleway/sdk-client', () => {
    expectTypeOf<string>().toExtend<LocalityName>()
  })

  it('accepts known sdk-client zones and regions', () => {
    expectTypeOf<'fr-par-1'>().toExtend<LocalityName>()
    expectTypeOf<'fr-par'>().toExtend<LocalityName>()
  })

  it('is a subtype of string', () => {
    expectTypeOf<LocalityName>().toExtend<string>()
  })

  it('includes the empty string used for global localities', () => {
    expectTypeOf<''>().toExtend<LocalityName>()
  })
})

describe('srn - locality', () => {
  it('uses LocalityName for the name field by default', () => {
    expectTypeOf<Locality['name']>().toEqualTypeOf<LocalityName>()
  })

  it('narrows name via the L parameter', () => {
    expectTypeOf<Locality<ConsoleLocalityName>['name']>().toEqualTypeOf<ConsoleLocalityName>()
  })
})

describe('srn - locality type', () => {
  it('is the sdk-client ApiLocality scopes without unspecified', () => {
    expectTypeOf<LocalityType>().toEqualTypeOf<'zone' | 'region' | 'global'>()
  })

  it('does not include the sdk-client unspecified scope', () => {
    expectTypeOf<'unspecified'>().not.toExtend<LocalityType>()
  })
})

describe('srn - generic product', () => {
  it('defaults product to string', () => {
    expectTypeOf<SRN['product']>().toEqualTypeOf<string>()
  })

  it('narrows product via the P parameter', () => {
    expectTypeOf<SRN<ConsoleProduct>['product']>().toEqualTypeOf<ConsoleProduct>()
  })
})

describe('srn - generic resource identifier', () => {
  it('defaults segment name to string', () => {
    expectTypeOf<ResourceIdentifierSegment['name']>().toEqualTypeOf<string>()
  })

  it('narrows segment name via the R parameter', () => {
    expectTypeOf<ResourceIdentifierSegment<ConsoleResource>['name']>().toEqualTypeOf<ConsoleResource>()
  })

  it('propagates R through the parent link', () => {
    expectTypeOf<
      ResourceIdentifierSegment<ConsoleResource>['parent']
    >().toEqualTypeOf<ResourceIdentifierSegment<ConsoleResource> | null>()
  })

  it('propagates R through root()', () => {
    expectTypeOf<ResourceIdentifierSegment<ConsoleResource>['root']>().returns.toEqualTypeOf<
      ResourceIdentifierSegment<ConsoleResource>
    >()
  })

  it('narrows resourceIdentifier on the SRN via R', () => {
    expectTypeOf<
      SRN<string, ConsoleResource>['resourceIdentifier']
    >().toEqualTypeOf<ResourceIdentifierSegment<ConsoleResource> | null>()
  })

  it('narrows locality.name on the SRN via L', () => {
    expectTypeOf<SRN<string, string, ConsoleLocalityName>['locality']['name']>().toEqualTypeOf<ConsoleLocalityName>()
  })

  it('defaults locality.name to LocalityName when L is omitted', () => {
    expectTypeOf<SRN['locality']['name']>().toEqualTypeOf<LocalityName>()
  })
})

describe('srn - stringifySRN accepts narrowed SRNs', () => {
  it('accepts the default broad SRN', () => {
    expectTypeOf(stringifySRN).parameters.toEqualTypeOf<[SRN]>()
  })

  it('accepts a fully narrowed SRN<ConsoleProduct, ConsoleResource, ConsoleLocalityName>', () => {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- typetest fixture: constructing a narrowed SRN without parsing
    const narrowed = {} as SRN<ConsoleProduct, ConsoleResource, ConsoleLocalityName>
    // If the narrowed SRN is accepted, this line compiles.
    expect(stringifySRN(narrowed)).toBeDefined()
  })
})

describe('srn - safeParseSRN result', () => {
  it('is a discriminated union on success', () => {
    expectTypeOf<SafeParseResult>().toExtend<SafeParseSuccess | SafeParseError>()
  })

  it('carries data: SRN on the success branch', () => {
    expectTypeOf<SafeParseSuccess['data']>().toEqualTypeOf<SRN>()
  })

  it('carries error: SRNParseError on the error branch', () => {
    expectTypeOf<SafeParseError['error']>().toEqualTypeOf<SRNParseError>()
  })

  it('narrows to data via Extract<_, { success: true }>', () => {
    expectTypeOf<Extract<SafeParseResult, { success: true }>['data']>().toEqualTypeOf<SRN>()
  })

  it('narrows to error via Extract<_, { success: false }>', () => {
    expectTypeOf<Extract<SafeParseResult, { success: false }>['error']>().toEqualTypeOf<SRNParseError>()
  })
})

describe('srn - parseSRN narrows at the call site', () => {
  it('returns the broad SRN by default', () => {
    expectTypeOf(parseSRN).returns.toEqualTypeOf<SRN>()
  })

  it('forwards P, R, L to SRN', () => {
    expectTypeOf(parseSRN<ConsoleProduct, ConsoleResource, ConsoleLocalityName>).returns.toEqualTypeOf<
      SRN<ConsoleProduct, ConsoleResource, ConsoleLocalityName>
    >()
  })
})

describe('srn - safeParseSRN narrows at the call site', () => {
  it('returns the broad SafeParseResult by default', () => {
    expectTypeOf(safeParseSRN).returns.toEqualTypeOf<SafeParseResult>()
  })

  it('forwards P, R, L to the success branch data', () => {
    expectTypeOf(safeParseSRN<ConsoleProduct, ConsoleResource, ConsoleLocalityName>).returns.toEqualTypeOf<
      SafeParseResult<ConsoleProduct, ConsoleResource, ConsoleLocalityName>
    >()
  })

  it('narrows data on the success branch when called with type args', () => {
    type Narrowed = SafeParseResult<ConsoleProduct, ConsoleResource, ConsoleLocalityName>
    expectTypeOf<Extract<Narrowed, { success: true }>['data']>().toEqualTypeOf<
      SRN<ConsoleProduct, ConsoleResource, ConsoleLocalityName>
    >()
  })
})
