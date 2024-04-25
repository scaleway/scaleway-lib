// eslint-disable-next-line import/no-extraneous-dependencies
import { vi } from 'vitest'

export const defaultGitValues = {
  branch: () => ({
    current: '',
  }),
  show: () => {},
  diffSummary: () => {},
  revparse: () => {},
  add: () => {},
  commit: () => {},
  push: () => {},
}

export const mockSimpleGit = vi.fn(() => defaultGitValues)

const simpleGit = () => mockSimpleGit()

export { simpleGit }
