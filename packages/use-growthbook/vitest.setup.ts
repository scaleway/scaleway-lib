import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

vi.mock('@growthbook/growthbook-react', async () => {
  const mod = await import('./src/__tests__/growthbookMock')

  return mod
})
