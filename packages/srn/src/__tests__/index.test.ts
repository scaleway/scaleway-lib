import { describe, expect, it } from 'vitest'
import { parseSRN, safeParseSRN, SRNParseError, stringifySRN } from '../index'

describe('parseSRN function', () => {
  it('parses a zonal SRN', () => {
    const s = parseSRN('srn://block.scw.eu/zones/it-mil-1/snapshots/22222222-3333-4444-5555-666666666666')
    expect(s.product).toBe('block')
    expect(s.platformDomain).toBe('scw.eu')
    expect(s.locality.name).toBe('it-mil-1')
    expect(s.locality.type).toBe('zone')
    expect(s.resourcePath).toBe('snapshots/22222222-3333-4444-5555-666666666666')
    expect(s.resourceIdentifier?.name).toBe('snapshots')
    expect(s.resourceIdentifier?.value).toBe('22222222-3333-4444-5555-666666666666')
    expect(s.resourceIdentifier?.isRoot()).toBe(true)
    expect(s.singletonSegment).toBe('')
  })

  it('parses a regional SRN', () => {
    const s = parseSRN('srn://k8s.scw.eu/regions/fr-par/clusters/abc')
    expect(s.locality.type).toBe('region')
    expect(s.locality.name).toBe('fr-par')
    expect(s.resourcePath).toBe('clusters/abc')
  })

  it('parses a global SRN', () => {
    const s = parseSRN('srn://iam.scw.eu/organizations/1234')
    expect(s.locality.type).toBe('global')
    expect(s.locality.name).toBe('')
    expect(s.resourcePath).toBe('organizations/1234')
  })

  it('parses nested resource identifiers', () => {
    const s = parseSRN('srn://dummy.scw.eu/zones/it-mil-1/resources/2222/nestedresource/1234')
    const leaf = s.resourceIdentifier
    expect(leaf?.name).toBe('nestedresource')
    expect(leaf?.value).toBe('1234')
    expect(leaf?.isRoot()).toBe(false)
    const root = leaf?.root()
    expect(root?.name).toBe('resources')
    expect(root?.value).toBe('2222')
    expect(root?.isRoot()).toBe(true)
  })

  it('parses a singleton tail segment', () => {
    const s = parseSRN('srn://x.scw.eu/zones/fr-par-1/resources/2222/singleton')
    expect(s.resourceIdentifier?.name).toBe('resources')
    expect(s.resourceIdentifier?.value).toBe('2222')
    expect(s.singletonSegment).toBe('singleton')
  })

  it('round-trips through stringify', () => {
    const input = 'srn://block.scw.eu/zones/it-mil-1/snapshots/22222222-3333-4444-5555-666666666666'
    expect(stringifySRN(parseSRN(input))).toBe(input)
  })

  it('round-trips a global SRN', () => {
    const input = 'srn://iam.scw.eu/organizations/1234'
    expect(stringifySRN(parseSRN(input))).toBe(input)
  })

  it('throws on invalid input', () => {
    expect(() => parseSRN('not-a-srn')).toThrow(SRNParseError)
  })

  it('throws when platform domain has no dot', () => {
    expect(() => parseSRN('srn://blockfoo/zones/x/y')).toThrow(SRNParseError)
  })
})

describe('safeParseSRN function', () => {
  it('returns a success result for a valid SRN', () => {
    const result = safeParseSRN('srn://block.scw.eu/zones/it-mil-1/snapshots/22222222')
    expect(result.success).toBe(true)
    expect(result).toMatchObject({
      data: {
        product: 'block',
        locality: { name: 'it-mil-1' },
        platformDomain: 'scw.eu',
      },
    })
  })

  it('returns an error result for an invalid SRN', () => {
    const result = safeParseSRN('not-a-srn')
    expect(result.success).toBe(false)
    expect(result).toMatchObject({
      error: {
        name: 'SRNParseError',
        message: 'parse: cannot break down the provided uri',
      },
    })
  })

  it('returns an error result when platform domain has no dot', () => {
    const result = safeParseSRN('srn://blockfoo/zones/x/y')
    expect(result.success).toBe(false)
    expect(result).toMatchObject({ error: { name: 'SRNParseError' } })
  })

  it('does not throw on invalid input', () => {
    expect(() => safeParseSRN('')).not.toThrow()
  })

  it('never throws, regardless of input', () => {
    // safeParseSRN's contract is that it never throws — it always returns a
    // discriminated union. Feed it a battery of hostile string inputs and
    // assert every call returns a result object with a boolean `success`.
    const inputs: string[] = [
      '',
      'not-a-srn',
      'srn://',
      'srn://x',
      'srn://x.y',
      'srn://x.y/',
      'srn://x.y/zones',
      'srn://x.y/zones/',
      'srn://x.y/zones/it-mil-1',
      'srn://x.y/zones/it-mil-1/',
      'srn://x.y/regions/fr-par',
      'srn://x.y//',
      'srn://x.y//singleton',
      '////',
      Math.random().toString(),
    ]

    for (const input of inputs) {
      const result = safeParseSRN(input)
      expect(result).toHaveProperty('success')
      expect(result.success).toBeTypeOf('boolean')
    }
  })
})
