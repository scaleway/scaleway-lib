import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import type { FileInfo } from '../types.ts'

function getAllFiles(dirPath: string, relativeTo: string): FileInfo[] {
  const files: FileInfo[] = []
  function scan(dir: string): void {
    const items = readdirSync(dir)
    for (const item of items) {
      const fullPath = join(dir, item)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        scan(fullPath)
      } else {
        files.push({
          checksum: createHash('sha256')
            .update(readFileSync(fullPath))
            .digest('hex'),
          path: relative(relativeTo, fullPath),
          size: stat.size,
        })
      }
    }
  }
  scan(dirPath)

  return files
}

export { getAllFiles }
