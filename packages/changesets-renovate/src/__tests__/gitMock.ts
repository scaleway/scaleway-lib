import { vi } from 'vitest'

export type GitMock = {
  add: () => undefined
  branch: () => { current: string }
  commit: () => undefined
  diffSummary: () => Record<string, unknown>
  push: () => undefined
  revparse: () => undefined
  show: () => string
}

export const defaultGitValues: GitMock = {
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

export const mockSimpleGit = vi.fn<() => GitMock>(() => defaultGitValues)
