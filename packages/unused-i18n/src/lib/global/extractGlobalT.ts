import type { ExtractTranslationArgs } from '../../types'

export const extractGlobalT = ({
  fileContent,
}: ExtractTranslationArgs): string[] => {
  const tPattern = /t\(\s*['"`]([\s\S]*?)['"`]\s*(?:,|$|\))/g
  const tPatternWithTernary =
    /t\(\s*([\s\S]+?)\s*\?\s*['"`]([^'"`\n]+)['"`]\s*:\s*['"`]([^'"`\n]+)['"`]\s*\)/gm
  const tVariablePattern = /t\(\s*([a-zA-Z_$][\w.$]*)\s*\)/g
  const tTemplatePattern = /t\(\s*`([\s\S]*?)`\s*\)/g

  const normalTs: Set<string> = new Set()

  let match

  // Handle ternary expressions within t arguments
  while ((match = tPatternWithTernary.exec(fileContent)) !== null) {
    const [, , trueValue, falseValue] = match
    if (trueValue) {
      normalTs.add(trueValue.replace(/'/g, '').replace(/,/g, '').trim())
    }
    if (falseValue) {
      normalTs.add(falseValue.replace(/'/g, '').replace(/,/g, '').trim())
    }
  }

  // Handle regular t pattern
  while ((match = tPattern.exec(fileContent))) {
    const translation = match[1]?.trim()

    if (translation?.includes('${')) {
      const ternaryPattern = /\${([^}]*\s\?\s[^}]*:[^}]*)}/
      const ternaryMatch = translation.match(ternaryPattern)

      if (ternaryMatch) {
        const [fullMatch, ternary] = ternaryMatch
        if (ternary) {
          const [ifValue, elseValue] = ternary
            .split(':')
            .map(val => val.trim().replace(/'/g, ''))
          if (ifValue && elseValue) {
            const stringIf = `${translation.replace(fullMatch, ifValue)}`
            const stringElse = `${translation.replace(fullMatch, elseValue)}`

            normalTs.add(stringIf)
            normalTs.add(stringElse)
          }
        }
      } else {
        normalTs.add(`${translation.replace(/\${[^}]*}/g, '**')}`)
      }
    } else if (translation) {
      normalTs.add(translation)
    }
  }

  // Handle variable t pattern
  while ((match = tVariablePattern.exec(fileContent))) {
    normalTs.add('**')
  }

  // Handle template literals within t arguments
  while ((match = tTemplatePattern.exec(fileContent))) {
    const templateLiteral = match[1]

    const dynamicParts = templateLiteral?.split(/(\${[^}]+})/).map(part => {
      if (part.startsWith('${') && part.endsWith('}')) {
        return '**'
      }

      return part
    })
    if (dynamicParts) {
      normalTs.add(dynamicParts.join(''))
    }
  }

  return Array.from(normalTs)
}
