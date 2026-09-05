import { vi } from 'vitest'

vi.mock('simple-git', async () => {
  const { simpleGit } = await import('./src/__tests__/simpleGitMock')

  return { simpleGit }
})
