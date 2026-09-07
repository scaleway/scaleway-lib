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

export type GitMock = typeof defaultGitValues

export const simpleGit = vi.fn<() => GitMock>(() => defaultGitValues)
