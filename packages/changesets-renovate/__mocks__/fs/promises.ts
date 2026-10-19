import { fs } from 'memfs'
import { vi } from 'vitest'

async function* glb() {
  // Default: no files
}

export const glob = vi.fn<(pattern: string | readonly string[], options?: unknown) => AsyncIterator<string>>(() =>
  glb(),
)
export const { readFile, writeFile } = fs.promises
