import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// oxlint-disable-next-line vitest/no-hooks vitest/require-top-level-describe
afterEach(() => {
  cleanup()
})
