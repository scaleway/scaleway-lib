import { readFileSync } from 'node:fs'
import { parse as parseYaml } from 'yaml'

type PackageJson = {
  name: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: unknown
}

type PnpmWorkspaceYaml = {
  packages: string[]
  catalog?: Record<string, string>
}

const isPackageJson = (value: unknown): value is PackageJson => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  return 'name' in value && typeof value['name'] === 'string'
}

export const readPackageJson = (file: string) => {
  const content = readFileSync(file, 'utf8')
  const rawJson: unknown = JSON.parse(content)

  if (!isPackageJson(rawJson)) {
    throw new Error(`invalid package.json in ${file}`)
  }

  return rawJson
}

const isPnpmWorkspaceYaml = (value: unknown): value is PnpmWorkspaceYaml => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  return 'packages' in value && Array.isArray(value['packages'])
}

export const readPnpmWorkspaceYaml = (file: string) => {
  const content = readFileSync(file, 'utf8')
  const rawYaml: unknown = parseYaml(content)

  if (!isPnpmWorkspaceYaml(rawYaml)) {
    throw new Error(`invalid pnpm-workspace.yaml in ${file}`)
  }

  return rawYaml
}
