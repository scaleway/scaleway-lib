export type PathConfig = {
  srcPath: string[]
  localPath: string
}

export type Config = {
  paths: PathConfig[]
  localesExtensions?: string
  localesNames?: string
  ignorePaths?: string[]
  excludeKey?: string | string[]
  scopedNames: string[]
}

type UnusedLocalesCountByPath = {
  path: string
  messages?: string
  warning?: string
}
export type ProcessTranslationsArgs = {
  paths?: { srcPath: string[]; localPath: string }[]
  action: 'remove' | 'display'
}
export type SummaryArgs = {
  unusedLocalesCountByPath: UnusedLocalesCountByPath[]
  totalUnusedLocales: number
}

export type AnalyzeArgs = {
  filePath: string
  scopedNames?: string[]
}
export type RemoveLocaleKeysArgs = {
  localePath: string
  missingTranslations: string[]
}
export type SearchFilesRecursivelyArgs = {
  baseDir: string
  regex: RegExp
  excludePatterns: RegExp[]
}
export type ExtractTranslationArgs = {
  fileContent: string
}
export type ExtractScopedTsArgs = {
  fileContent: string
  namespaceTranslation: string
  scopedName: string
}
export type GetMissingTranslationsArgs = {
  localLines: string[]
  extractedTranslations: string[]
  excludeKey: string | string[] | undefined
}
export type ShouldExcludeArgs = {
  line: string
  excludeKey?: string | string[]
}
