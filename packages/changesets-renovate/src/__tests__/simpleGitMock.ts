import { vi } from 'vitest'

export const defaultGitValues = {
  add: () => undefined,
  branch: () => ({
    current: '',
  }),
  commit: () => undefined,
  diffSummary: () => ({}),
  push: () => undefined,
  revparse: () => undefined,
  show: () => '',
}

export const mockSimpleGit = vi.fn(() => defaultGitValues)

export const simpleGit = () => mockSimpleGit()
