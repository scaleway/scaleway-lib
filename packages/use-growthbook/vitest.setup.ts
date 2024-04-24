import * as matchers from '@testing-library/jest-dom/matchers'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, expect, vi } from 'vitest'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

vi.mock('@growthbook/growthbook-react')
