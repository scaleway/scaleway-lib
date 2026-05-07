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
})

export default config
