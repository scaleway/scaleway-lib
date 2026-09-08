import type { Mock } from 'vitest'

declare module 'simple-git' {
  export type GitMock = {
    add: () => undefined
    branch: () => { current: string }
    commit: () => undefined
    diffSummary: () => Record<string, unknown>
    push: () => undefined
    revparse: () => undefined
    show: () => string
  }
  export const defaultGitValues: GitMock
  export const mockSimpleGit: Mock<() => GitMock>
}
