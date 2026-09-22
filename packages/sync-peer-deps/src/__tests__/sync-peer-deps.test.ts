import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { processPackageJson } from '../index.js'

const basePackage = {
  name: 'test-pkg',
  version: '1.0.0',
}

const tmpFiles: string[] = []

async function writeTmpPackage(json: Record<string, unknown>): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), 'sync-peer-'))
  const file = path.join(dir, 'package.json')
  await writeFile(file, JSON.stringify({ ...basePackage, ...json }, undefined, 2), 'utf8')
  return file
}

const getPeer = (value: unknown, dep: string): string => {
  if (typeof value !== 'object' || value === null || !('peerDependencies' in value)) {
    return ''
  }
  const peers = value.peerDependencies
  if (typeof peers !== 'object' || peers === null) {
    return ''
  }
  const entries = Object.entries(peers).find(([key]) => key === dep)
  return entries && typeof entries[1] === 'string' ? entries[1] : ''
}

const readPeer = async (file: string, dep: string): Promise<string> =>
  getPeer(JSON.parse(await readFile(file, 'utf8')), dep)

describe('sync-peer-deps', () => {
  afterAll(async () => {
    await Promise.all(
      tmpFiles.map(async file => {
        await rm(path.dirname(file), { recursive: true, force: true })
      }),
    )
  })

  it('does not clobber a broad peer range (||) with the dev pin', async () => {
    const file = await writeTmpPackage({
      devDependencies: { react: '^19.3.0' },
      peerDependencies: { react: '18.x || 19.x' },
    })
    tmpFiles.push(file)

    const changes = await processPackageJson(file)
    const peer = await readPeer(file, 'react')
    expect(changes).toBe(0)
    expect(peer).toBe('18.x || 19.x')
  })

  it('does not clobber a >= peer range with the dev pin', async () => {
    const file = await writeTmpPackage({
      devDependencies: { react: '^19.3.0' },
      peerDependencies: { react: '>=16.8' },
    })
    tmpFiles.push(file)

    const changes = await processPackageJson(file)
    const peer = await readPeer(file, 'react')
    expect(changes).toBe(0)
    expect(peer).toBe('>=16.8')
  })

  it('syncs a pinned peer when the dev version is a real semver pin', async () => {
    const file = await writeTmpPackage({
      devDependencies: { react: '^19.4.0' },
      peerDependencies: { react: '^19.3.0' },
    })
    tmpFiles.push(file)

    const changes = await processPackageJson(file)
    const peer = await readPeer(file, 'react')
    expect(changes).toBe(1)
    expect(peer).toBe('^19.4.0')
  })

  it('does not leak catalog: dev references into peerDependencies', async () => {
    const file = await writeTmpPackage({
      devDependencies: { react: 'catalog:' },
      peerDependencies: { react: '^19.3.0' },
    })
    tmpFiles.push(file)

    const changes = await processPackageJson(file)
    const peer = await readPeer(file, 'react')
    expect(changes).toBe(0)
    expect(peer).toBe('^19.3.0')
  })

  it('does not leak workspace: dev references into peerDependencies', async () => {
    const file = await writeTmpPackage({
      devDependencies: { react: 'workspace:*' },
      peerDependencies: { react: '^19.3.0' },
    })
    tmpFiles.push(file)

    const changes = await processPackageJson(file)
    const peer = await readPeer(file, 'react')
    expect(changes).toBe(0)
    expect(peer).toBe('^19.3.0')
  })

  it('is a no-op when peer and dev are already in sync', async () => {
    const file = await writeTmpPackage({
      devDependencies: { react: '^19.3.0' },
      peerDependencies: { react: '^19.3.0' },
    })
    tmpFiles.push(file)

    const changes = await processPackageJson(file)
    expect(changes).toBe(0)
  })

  it('does not clobber a * wildcard peer range', async () => {
    const file = await writeTmpPackage({
      devDependencies: { react: '^19.3.0' },
      peerDependencies: { react: '*' },
    })
    tmpFiles.push(file)

    const changes = await processPackageJson(file)
    const peer = await readPeer(file, 'react')
    expect(changes).toBe(0)
    expect(peer).toBe('*')
  })

  it('syncs a ~ pin peer when the dev version is a real semver pin', async () => {
    const file = await writeTmpPackage({
      devDependencies: { react: '~19.4.0' },
      peerDependencies: { react: '~19.3.0' },
    })
    tmpFiles.push(file)

    const changes = await processPackageJson(file)
    const peer = await readPeer(file, 'react')
    expect(changes).toBe(1)
    expect(peer).toBe('~19.4.0')
  })

  it('syncs an exact-version peer when the dev version is a real semver pin', async () => {
    const file = await writeTmpPackage({
      devDependencies: { react: '19.4.0' },
      peerDependencies: { react: '19.3.0' },
    })
    tmpFiles.push(file)

    const changes = await processPackageJson(file)
    const peer = await readPeer(file, 'react')
    expect(changes).toBe(1)
    expect(peer).toBe('19.4.0')
  })

  it('does not leak workspace:^ dev references into peerDependencies', async () => {
    const file = await writeTmpPackage({
      devDependencies: { react: 'workspace:^1.0.0' },
      peerDependencies: { react: '^19.3.0' },
    })
    tmpFiles.push(file)

    const changes = await processPackageJson(file)
    const peer = await readPeer(file, 'react')
    expect(changes).toBe(0)
    expect(peer).toBe('^19.3.0')
  })

  it('does not leak named catalog: dev references into peerDependencies', async () => {
    const file = await writeTmpPackage({
      devDependencies: { react: 'catalog:react19' },
      peerDependencies: { react: '^19.3.0' },
    })
    tmpFiles.push(file)

    const changes = await processPackageJson(file)
    const peer = await readPeer(file, 'react')
    expect(changes).toBe(0)
    expect(peer).toBe('^19.3.0')
  })

  it('handles mixed deps: broad range skipped, pin synced in the same package', async () => {
    const file = await writeTmpPackage({
      devDependencies: { react: '^19.4.0', 'react-dom': '^19.4.0' },
      peerDependencies: { react: '18.x || 19.x', 'react-dom': '^19.3.0' },
    })
    tmpFiles.push(file)

    const changes = await processPackageJson(file)
    const reactPeer = await readPeer(file, 'react')
    const reactDomPeer = await readPeer(file, 'react-dom')
    expect(changes).toBe(1)
    expect(reactPeer).toBe('18.x || 19.x')
    expect(reactDomPeer).toBe('^19.4.0')
  })

  it('skips a peer that is not in devDependencies', async () => {
    const file = await writeTmpPackage({
      devDependencies: { react: '^19.3.0' },
      peerDependencies: { react: '^19.3.0', 'some-other-pkg': '^1.0.0' },
    })
    tmpFiles.push(file)

    const changes = await processPackageJson(file)
    expect(changes).toBe(0)
  })

  it('preserves the original indentation of the package.json', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'sync-peer-'))
    const file = path.join(dir, 'package.json')
    await writeFile(
      file,
      JSON.stringify(
        { ...basePackage, devDependencies: { react: '^19.4.0' }, peerDependencies: { react: '^19.3.0' } },
        undefined,
        4,
      ),
      'utf8',
    )
    tmpFiles.push(file)

    await processPackageJson(file)
    const raw = await readFile(file, 'utf8')
    expect(raw).toContain('    "react"')
  })
})
