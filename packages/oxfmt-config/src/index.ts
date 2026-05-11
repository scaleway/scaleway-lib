import { deepmerge } from 'deepmerge-ts'
import type { OxfmtConfig } from 'oxfmt'
import { defineConfig } from 'oxfmt'

const config: OxfmtConfig = defineConfig({
  useTabs: false,
  tabWidth: 2,
  printWidth: 120,
  singleQuote: true,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  semi: false,
  arrowParens: 'avoid',
  bracketSameLine: false,
  bracketSpacing: true,
  sortPackageJson: true,
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  objectWrap: 'preserve',
  proseWrap: 'preserve',
  sortImports: {
    newlinesBetween: false,
    order: 'asc',
  },
  ignorePatterns: [
    'CHANGELOG.md',
    '.changeset',
    'pnpm-workspace.yaml',
    '**/_generated',
    '**/*.gen.*',
    '**/.next',
    '**/next-env.d.ts',
    '**/.output',
    '**/dist',
    '**/build',
    '**/out',
    '**/.turbo',
    '**/storybook-static',
    '**/.cache',
    '**/public/build',
    '**/.vite',
    '**/coverage',
    '**/.nyc_output',
    '**/*.auto.*',
    '**/graphql-types.*',
    '**/schema.d.ts',
    '**/schema.graphql.d.ts',
    '**/*.d.ts.map',
  ],
})

const mergeConfig = (configA: OxfmtConfig, configB: OxfmtConfig): OxfmtConfig => deepmerge(configA, configB)

export { mergeConfig }
export default config
