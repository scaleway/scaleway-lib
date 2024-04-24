// import type { SimpleGit } from 'simple-git'
// eslint-disable-next-line import/no-extraneous-dependencies
import { vi } from 'vitest'

export const mockSimpleGit = vi.fn(() => ({
  branch: () => ({
    current: '',
  }),
  show: () => {},
  diffSummary: () => {},
}))

const simpleGit = () => mockSimpleGit()

export { simpleGit }
