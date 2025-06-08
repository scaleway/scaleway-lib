import * as fs from 'fs'
import * as path from 'path'
import { type BuildResult, build } from 'esbuild'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadConfig } from '../loadConfig'

vi.mock('fs')
vi.mock('esbuild', () => ({
  build: vi.fn(),
}))
vi.mock('path')

describe('loadConfig', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(process, 'cwd').mockReturnValue('/mocked/cwd')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should load JSON config file correctly', async () => {
    const configPath = '/mocked/cwd/unused-i18n.config.json'
    const configContent = '{"test": "value"}'
    const existsSyncImpl = (filePath: string) => filePath === configPath

    vi.mocked(() => path.resolve()).mockImplementation((...args: string[]) =>
      args.join('/'),
    )
    vi.mocked((arg: string) => path.extname(arg)).mockReturnValue('.json')

    vi.mocked(fs.existsSync).mockImplementation(
      existsSyncImpl as typeof fs.existsSync,
    )
    vi.mocked(fs.readFileSync).mockReturnValue(configContent)

    const config = await loadConfig()

    expect(config).toEqual({ test: 'value' })
    expect(fs.existsSync).toHaveBeenCalledWith(configPath)
    expect(fs.readFileSync).toHaveBeenCalledWith(configPath, 'utf-8')
  })
  it('should load TypeScript config file correctly', async () => {
    const configPath = '/mocked/cwd/unused-i18n.config.ts'
    const jsCode = 'export default { test: "value" }'
    const buildResult = { outputFiles: [{ text: jsCode }] }
    const existsSyncImpl = (filePath: string) => filePath === configPath

    vi.mocked(() => path.resolve()).mockImplementation((...args: string[]) =>
      args.join('/'),
    )
    vi.mocked((arg: string) => path.extname(arg)).mockReturnValue('.ts')

    vi.mocked(fs.existsSync).mockImplementation(
      existsSyncImpl as typeof fs.existsSync,
    )
    vi.mocked(build).mockResolvedValue(buildResult as BuildResult)

    const config = await loadConfig()
    expect(config).toEqual({ test: 'value' })
    expect(fs.existsSync).toHaveBeenCalledWith(configPath)
    expect(build).toHaveBeenCalledWith({
      entryPoints: [configPath],
      outfile: 'config.js',
      platform: 'node',
      format: 'esm',
      bundle: true,
      write: false,
    })
  })

  it('should throw an error if no config file is found', async () => {
    vi.mocked(() => path.resolve()).mockImplementation((...args: string[]) =>
      args.join('/'),
    )

    vi.mocked(fs.existsSync).mockReturnValue(false)

    await expect(loadConfig()).rejects.toThrow(
      'Configuration file unused-i18n.config not found. Supported extensions: .json, .js, .cjs, .ts.',
    )

    expect(fs.existsSync).toHaveBeenCalledTimes(4)
    expect(fs.existsSync).toHaveBeenCalledWith(
      '/mocked/cwd/unused-i18n.config.json',
    )
    expect(fs.existsSync).toHaveBeenCalledWith(
      '/mocked/cwd/unused-i18n.config.js',
    )
    expect(fs.existsSync).toHaveBeenCalledWith(
      '/mocked/cwd/unused-i18n.config.cjs',
    )
    expect(fs.existsSync).toHaveBeenCalledWith(
      '/mocked/cwd/unused-i18n.config.ts',
    )
  })
})
