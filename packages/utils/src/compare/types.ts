export type FileInfo = {
  path: string
  size: number
  checksum: string
}

export type PackageInfo = {
  files: FileInfo[]
  total_files: number
  total_size: number
}

export type Manifest = {
  timestamp: string
  vite_version: string
  packages: Record<string, PackageInfo>
}
