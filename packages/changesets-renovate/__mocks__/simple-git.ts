import { vi } from 'vitest'

export const defaultGitValues = {
  add: (): void => undefined,
  branch: () => ({
    current: '',
  }),
  commit: (): void => undefined,
  diffSummary: () => ({}),
  push: (): void => undefined,
  revparse: (): string => '',
  show: () => '',
}

export const mockSimpleGit = vi.fn(() => defaultGitValues)

const simpleGit = () => mockSimpleGit()

export { simpleGit }
