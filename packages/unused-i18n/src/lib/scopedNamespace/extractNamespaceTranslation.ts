import type { ExtractTranslationArgs } from '../../types'

export const extractNamespaceTranslation = ({
  fileContent,
}: ExtractTranslationArgs): string[] => {
  // Match regular namespaceTranslation
  const namespaceTranslationPattern =
    /namespaceTranslation\(\s*['"`]([\s\S]*?)['"`]\s*,?\s*\)/g

  // Match ternary inside namespaceTranslation
  const namespaceTranslationPatternTernary =
    /namespaceTranslation\(\s*([^?]+?)\s*\?\s*['"`]([^'"\\`\n]+)['"`]\s*:\s*['"`]([^'"\\`\n]+)['"`]\s*,?\s*\)/g

  // Match template literal inside namespaceTranslation
  const namespaceTranslationPatternTemplateLiteral =
    /namespaceTranslation\(\s*`([\s\S]*?)`\s*\)/g

  const matches: string[] = []
  let match

  // Extract regular namespaceTranslation matches
  while ((match = namespaceTranslationPattern.exec(fileContent)) !== null) {
    if (match[1]) {
      matches.push(match[1].trim())
    }
  }

  // Extract ternary matches inside namespaceTranslation
  while (
    (match = namespaceTranslationPatternTernary.exec(fileContent)) !== null
  ) {
    if (match[2] && match[3]) {
      const trueValue = match[2].trim()
      const falseValue = match[3].trim()
      matches.push(trueValue, falseValue)
    }
  }

  // Extract template literal matches inside namespaceTranslation
  while (
    (match = namespaceTranslationPatternTemplateLiteral.exec(fileContent)) !==
    null
  ) {
    if (match[1]) {
      const templateLiteral = match[1].trim()
      // Find the dynamic parts inside `${}` in the template literal
      const dynamicPartsMatch = /\${([^}]+)}/g
      let dynamicPart
      while ((dynamicPart = dynamicPartsMatch.exec(templateLiteral)) !== null) {
        if (dynamicPart[1]) {
          const dynamicExpression = dynamicPart[1].trim()

          // Now handle ternary expression inside this dynamic part
          const ternaryMatch =
            /([^?]+?)\s*\?\s*['"`]([^'"\\`\n]+)['"`]\s*:\s*['"`]([^'"\\`\n]+)['"`]/g
          let ternaryInnerMatch
          while (
            (ternaryInnerMatch = ternaryMatch.exec(dynamicExpression)) !== null
          ) {
            if (ternaryInnerMatch[2] && ternaryInnerMatch[3]) {
              const trueValue = ternaryInnerMatch[2].trim()
              const falseValue = ternaryInnerMatch[3].trim()
              matches.push(trueValue, falseValue)
            }
          }

          // Push the dynamic expression result into the matches
          matches.push(dynamicExpression)
        }

        // Push the whole template literal into the matches
        matches.push(templateLiteral)
      }
    }
  }

  // Remove duplicates and return the sorted result
  return [...new Set(matches)].sort()
}
