import { describe, expect, it, vi } from 'vitest'
import { getMissingTranslations } from "../missingTranslations"
import { shouldExclude } from "../shouldExclude"

vi.mock('../../utils/shouldExclude', () => ({
  shouldExclude: vi.fn(),
}))

describe('getMissingTranslations', () => {
  it('should return missing translations', () => {
    const localLines = [
      'billing.back.organization',
      'billing.back.organization.dsds',
      'dsds',
      'billing.budget.alert.go',
    ]

    const extractedTranslations = [
      'billing.back.organization',
      'billing.budget.alert.**',
      '**',
    ]

    const excludeKey: string[] = []

    vi.mocked(shouldExclude).mockReturnValue(false)

    const result = getMissingTranslations({
      localLines,
      extractedTranslations,
      excludeKey,
    })

    const expected = ['billing.back.organization.dsds']

    expect(result).toEqual(expected)
  })

  it('should exclude keys based on shouldExclude', () => {
    const localLines = [
      'billing.back.organization',
      'billing.back.organization.dsds',
      'dsds',
      'billing.budget.alert.go.error',
    ]

    const extractedTranslations = [
      'billing.back.organization',
      'billing.budget.alert.**',
    ]

    const excludeKey = ['dsds']
    vi.mocked(shouldExclude).mockImplementation(
      ({ line, excludeKey: keys }) => keys?.includes(line) ?? false,
    )

    const result = getMissingTranslations({
      localLines,
      extractedTranslations,
      excludeKey,
    })

    const expected = ['billing.back.organization.dsds']

    expect(result).toEqual(expected)
  })
})
