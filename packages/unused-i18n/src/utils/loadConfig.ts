import * as fs from 'fs'
import { extname, resolve } from 'path'
import { build } from 'esbuild'
import type { Config } from '../types'

const supportedExtensions = ['.json', '.js', '.cjs', '.ts']

export const loadConfig = async (): Promise<Config> => {
  const cwd = process.cwd()
  let configPath = ''

  for (const ext of supportedExtensions) {
    const potentialPath = resolve(cwd, `unused-i18n.config${ext}`)
    if (fs.existsSync(potentialPath)) {
      configPath = potentialPath
      break
    }
  }

  if (!configPath) {
    throw new Error(
      'Configuration file unused-i18n.config not found. Supported extensions: .json, .js, .cjs, .ts.',
    )
  }

  const extension = extname(configPath)

  if (extension === '.json') {
    const configContent = fs.readFileSync(configPath, 'utf-8')

    return JSON.parse(configContent) as Config
  }

  if (extension === '.ts') {
    const result = await build({
      entryPoints: [configPath],
      outfile: 'config.js',
      platform: 'node',
      format: 'esm',
      bundle: true,
      write: false,
    })

    const jsCode = result.outputFiles[0]?.text ?? ''
    const module = (await import(
      `data:application/javascript,${encodeURIComponent(jsCode)}`
    )) as { default: Config }

    return module.default
  }

  const module = (await import(configPath)) as { default: Config }

  return module.default
}
