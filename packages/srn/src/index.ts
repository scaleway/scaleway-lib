export type LocalityType = 'zone' | 'region' | 'global'

export type Locality = {
  readonly name: string
  readonly type: LocalityType
}

export type ResourceIdentifierSegment = {
  readonly name: string
  readonly value: string
  readonly parent: ResourceIdentifierSegment | null
  readonly root: () => ResourceIdentifierSegment
  readonly isRoot: () => boolean
}

export type SRN = {
  readonly product: string
  readonly platformDomain: string
  readonly locality: Locality
  readonly resourcePath: string
  readonly resourceIdentifier: ResourceIdentifierSegment | null
  readonly singletonSegment: string
  readonly toString: () => string
}

const SRN_RE = /^srn:\/\/(?<product>[^.]+)\.(?<platform>[^\/]+)\/(?<path>.*)$/sv
const LOCALITY_RE = /^(?<loc>[^\/]+)\/(?<locName>[^\/]+)\//v

export class SRNParseError extends Error {
  public constructor(message: string) {
    super(message)
    this.name = 'SRNParseError'
  }
}

function localityPrefix(type: LocalityType, name: string): string {
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

function makeSegment(name: string, value: string, parent: ResourceIdentifierSegment | null): ResourceIdentifierSegment {
  return {
    name,
    value,
    parent,
    isRoot: () => parent === null,
    root(): ResourceIdentifierSegment {
      return this.parent === null ? this : this.parent.root()
    },
  }
}

export function stringifySRN(srn: SRN): string {
  if (!srn.product && !srn.platformDomain) {
    return 'undefined'
  }
  const parts: string[] = []
  const prefix = localityPrefix(srn.locality.type, srn.locality.name)
  if (prefix !== '') {
    parts.push(prefix)
  }
  parts.push(srn.resourcePath)
  return `srn://${srn.product}.${srn.platformDomain}/${parts.join('/')}`
}

export function parseSRN(input: string): SRN {
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
    const parent = resourceIdentifier
    resourceIdentifier = makeSegment(key, value, parent)
  }

  const locality: Locality = { name: locName, type: locType }

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
