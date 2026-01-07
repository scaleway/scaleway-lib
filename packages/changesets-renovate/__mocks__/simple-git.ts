import { vi } from 'vitest'

export const defaultGitValues = {
  add: () => {},
  branch: () => ({
    current: '',
  }),
  commit: () => {},
  diffSummary: () => {},
  push: () => {},
  revparse: () => {},
  show: () => {},
}

export const mockSimpleGit = vi.fn(() => defaultGitValues)

const simpleGit = () => mockSimpleGit()

export { simpleGit }
