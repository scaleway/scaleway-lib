import type { ExtractScopedTsArgs } from '../../types'

export const extractScopedTs = ({
  scopedName,
  namespaceTranslation,
  fileContent,
}: ExtractScopedTsArgs): string[] => {
  // Patterns with the variable
  const scopedTPattern = new RegExp(
    `${scopedName}\\(\\s*['"\`]([\\s\\S]*?)['"\`]\\s*(?:,|\\))`,
    'g',
  )
  const scopedTPatternWithTernary = new RegExp(
    `${scopedName}\\(\\s*([\\s\\S]+?)\\s*\\?\\s*['"\`]([^'"\\\`\n]+)['"\`']\\s*:\\s*['"\`']([^'"\\\`\n]+)['"\`],?\\s*\\)`,
    'gm',
  )
  const scopedTPatternWithTernaryAndParams = new RegExp(
    `${scopedName}\\(\\s*([^?\n]+)\\s*\\?\\s*['"\`]([^'"\\\`]+)['"\`']\\s*:\\s*['"\`']([^'"\\\`]+)['"\`'],\\s*\\{[\\s\\S]*?\\},?\\s*\\)`,
    'gm',
  )
  const scopedTVariablePattern = new RegExp(
    `${scopedName}\\(\\s*([a-zA-Z_$][\\w.$]*)\\s*\\)`,
    'g',
  )
  const scopedTTemplatePattern = new RegExp(
    `${scopedName}\\(\\s*\`([\\s\\S]*?)\`\\s*\\)`,
    'g',
  )

  const scopedTs: Set<string> = new Set()
  const namespaceTranslationTrimmed = namespaceTranslation
    .replace(/'/g, '')
    .replace(/,/g, '')

  let match

  // Handle ternary expressions within scopedT arguments
  while ((match = scopedTPatternWithTernary.exec(fileContent))) {
    const trueValue = match[2]
    const falseValue = match[3]

    if (trueValue) {
      scopedTs.add(
        `${namespaceTranslationTrimmed}.${trueValue
          .replace(/'/g, '')
          .replace(/,/g, '')
          .trim()}`,
      )
    }
    if (falseValue) {
      scopedTs.add(
        `${namespaceTranslationTrimmed}.${falseValue
          .replace(/'/g, '')
          .replace(/,/g, '')
          .trim()}`,
      )
    }
  }

  // Handle ternary expressions with additional parameters within scopedT arguments
  while ((match = scopedTPatternWithTernaryAndParams.exec(fileContent))) {
    const trueValue = match[2]?.trim() ?? ''
    const falseValue = match[3]?.trim() ?? ''

    scopedTs.add(
      `${namespaceTranslationTrimmed}.${trueValue
        .replace(/'/g, '')
        .replace(/,/g, '')}`,
    )
    scopedTs.add(
      `${namespaceTranslationTrimmed}.${falseValue
        .replace(/'/g, '')
        .replace(/,/g, '')}`,
    )
  }

  // Handle regular scopedT pattern
  while ((match = scopedTPattern.exec(fileContent))) {
    const scopedT = match[1]?.trim()

    const scopedTWithNamespace = `${namespaceTranslationTrimmed}.${scopedT}`

    if (scopedT?.includes('${')) {
      const ternaryPattern = /\${([^}]*\s\?\s[^}]*:[^}]*)}/
      const ternaryMatch = scopedTWithNamespace.match(ternaryPattern)

      if (ternaryMatch) {
        const [fullMatch, ternary] = ternaryMatch
        if (ternary) {
          const parts = ternary.split(' ? ')[1]?.split(':')
          if (parts && parts.length === 2) {
            const [ifValue, elseValue] = parts.map(val =>
              val.trim().replace(/'/g, ''),
            )
            if (ifValue && elseValue) {
              const stringIf = `${scopedTWithNamespace.replace(fullMatch, ifValue)}`
              const stringElse = `${scopedTWithNamespace.replace(fullMatch, elseValue)}`

              scopedTs.add(stringIf)
              scopedTs.add(stringElse)
            }
          }
        }
      } else {
        scopedTs.add(`${scopedTWithNamespace.replace(/\${[^}]*}/g, '**')}`)
      }
    } else {
      scopedTs.add(scopedTWithNamespace)
    }
  }

  // Handle variable scopedT pattern
  while ((match = scopedTVariablePattern.exec(fileContent))) {
    const scopedTWithNamespace = `${namespaceTranslationTrimmed}.**`
    scopedTs.add(scopedTWithNamespace)
  }

  // Handle template literals within scopedT arguments
  while ((match = scopedTTemplatePattern.exec(fileContent))) {
    const templateLiteral = match[1]
    if (templateLiteral) {
      const dynamicParts = templateLiteral.split(/(\$\{[^}]+})/).map(part => {
        if (part.startsWith('${') && part.endsWith('}')) {
          return '**'
        }

        return part
      })
      const scopedTWithNamespace = `${namespaceTranslationTrimmed}.${dynamicParts.join(
        '',
      )}`
      scopedTs.add(scopedTWithNamespace)
    }
  }

  return Array.from(scopedTs)
}
