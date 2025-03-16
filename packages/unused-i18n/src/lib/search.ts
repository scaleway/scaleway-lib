import * as fs from 'fs'
import * as path from 'path'
import type { SearchFilesRecursivelyArgs } from '../types'

export const searchFilesRecursively = ({
  baseDir,
  regex,
  excludePatterns,
}: SearchFilesRecursivelyArgs): string[] => {
  const foundFiles: string[] = []

  function searchRecursively(directory: string): void {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      const fullPath = path.join(directory, file)
      // Skip excluded patterns
      if (excludePatterns.some(pattern => pattern.test(fullPath))) {
        return
      }
      if (fs.lstatSync(fullPath).isDirectory()) {
        searchRecursively(fullPath)
      } else if (regex.test(fs.readFileSync(fullPath, 'utf-8'))) {
        foundFiles.push(fullPath)
      }
    }
  }

  searchRecursively(baseDir)

  return foundFiles
}
