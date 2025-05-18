import * as fs from 'fs'
import { describe, expect, it, vi } from 'vitest'
import { analyze } from '../analyze'
import { extractGlobalT } from '../global/extractGlobalT'
import { extractNamespaceTranslation } from '../scopedNamespace/extractNamespaceTranslation'
import { extractScopedTs } from '../scopedNamespace/extractScopedTs'

const mockFilePath = '/path/to/test/file.js'
const mockScopedNames = ['scopedT', 'scopedTOne']

const fileContent = `
    import { useI18n } from '@scaleway/use-i18n'
    const scopedT = namespaceTranslation('namespace');
    {keyLabel ?? scopedT('labelKey1')}
    {keyLabel ? scopedT('labelKey2') : scopedT('labelKey3')}
    {scopedT(keyLabel ? 'labelKey4' : 'labelKey5')}
    {scopedT(\`labelKey6.\${variable}\`)}
    {scopedT(variable0)}
    {scopedT(\`\${variable1}.\${variable2}\`)}
    {t(\`\${variable3}.\${variable4}\`)}
    {keyLabel ?? t('labelKey8')}
    {keyLabel ? t('labelKey9') : t('labelKey10')}
    {t(\`labelKey11.\${variable5}\`)}
    {t(\`labelKey12.\${variable6}\`)}
    toast.success(t('account.user.modal.edit.changeEmail'));
    { [FORM_ERROR]: t('form.errors.formErrorNoRetry') };
    {scopedTOne('labelKey13', {
      name: scopedT('labelKey14')
    })}
  `

const expectedTranslationResults = [
  'account.user.modal.edit.changeEmail',
  'form.errors.formErrorNoRetry',
  'labelKey10',
  'labelKey11.**',
  'labelKey12.**',
  'labelKey8',
  'labelKey9',
  '**.**',
  'namespace.**',
  'namespace.**.**',
  'namespace.labelKey1',
  'namespace.labelKey13',
  'namespace.labelKey14',
  'namespace.labelKey2',
  'namespace.labelKey3',
  'namespace.labelKey4',
  'namespace.labelKey5',
  'namespace.labelKey6.**',
]

vi.mock('fs')

vi.mock('../global/extractGlobalT', () => ({
  extractGlobalT: vi.fn(() => [
    'labelKey8',
    'labelKey9',
    'labelKey10',
    'labelKey11.**',
    'labelKey12.**',
    'account.user.modal.edit.changeEmail',
    'form.errors.formErrorNoRetry',
  ]),
}))

vi.mock('../scopedNamespace/extractNamespaceTranslation', () => ({
  extractNamespaceTranslation: vi.fn(() => [
    'namespace.labelKey1',
    'namespace.labelKey2',
    'namespace.labelKey3',
    'namespace.labelKey4',
    'namespace.labelKey5',
    'namespace.labelKey6.**',
    'namespace.**',
    'namespace.**.**',
  ]),
}))

vi.mock('../scopedNamespace/extractScopedTs', () => ({
  extractScopedTs: vi.fn(() => [
    '**.**',
    'namespace.**',
    'namespace.**.**',
    'namespace.labelKey1',
    'namespace.labelKey13',
    'namespace.labelKey14',
    'namespace.labelKey2',
    'namespace.labelKey3',
    'namespace.labelKey4',
    'namespace.labelKey5',
    'namespace.labelKey6.**',
  ]),
}))

describe('analyze', () => {
  it('should extract all translations correctly from the file', () => {
    vi.mocked(fs.readFileSync).mockReturnValue(fileContent)

    const result = analyze({
      filePath: mockFilePath,
      scopedNames: mockScopedNames,
    })

    expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, 'utf-8')
    expect(extractGlobalT).toHaveBeenCalledWith({ fileContent })
    expect(extractNamespaceTranslation).toHaveBeenCalledWith({ fileContent })

    expect(extractScopedTs).toHaveBeenCalledWith({
      fileContent,
      namespaceTranslation: 'namespace.labelKey1',
      scopedName: 'scopedT',
    })

    expect(extractScopedTs).toHaveBeenCalledTimes(16)

    expect(extractScopedTs).toHaveBeenNthCalledWith(5, {
      fileContent,
      namespaceTranslation: 'namespace.labelKey5',
      scopedName: 'scopedT',
    })

    expect(result).toEqual(expect.arrayContaining(expectedTranslationResults))
    expect(expectedTranslationResults).toEqual(expect.arrayContaining(result))
  })
})
