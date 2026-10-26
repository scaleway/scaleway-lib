import type { Attributes, GrowthBook, InitResponse } from '@growthbook/growthbook-react'
import { useGrowthBook } from '@growthbook/growthbook-react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { useAbTestAttributes } from '../useAbTestAttributes'

// Activates the manual mock in __mocks__ (used to live in the deleted vitest.setup.ts)
vi.mock(import('@growthbook/growthbook-react'))

const getAttributes = vi.fn<() => Record<string, unknown>>()
const setAttributes = vi.fn<(attr: Attributes) => Promise<void>>()

describe(useAbTestAttributes, () => {
  beforeEach(() => {
    getAttributes.mockReturnValue({ foo: 'bar' })
    setAttributes.mockResolvedValue(undefined)

    vi.mocked(useGrowthBook).mockReturnValue({
      getAttributes,
      init: vi.fn<() => Promise<InitResponse>>(),
      loadFeatures: vi.fn<() => Promise<void>>(),
      setAttributes,
    } as unknown as GrowthBook)
  })

  it('should allow to get attributes from GrowthBook', async () => {
    const {
      result: {
        current: [attributes],
      },
    } = await renderHook(() => useAbTestAttributes())

    expect(getAttributes).toHaveBeenCalledTimes(1)
    expect(attributes).toStrictEqual({ foo: 'bar' })
  })

  it('should allow to set Attributes through Growthbook', async () => {
    const {
      result: {
        current: [, setAttributesNow],
      },
    } = await renderHook(() => useAbTestAttributes())
    await setAttributesNow({ bar: 'foo' })
    expect(setAttributes).toHaveBeenCalledTimes(1)
    expect(setAttributes).toHaveBeenCalledWith({ bar: 'foo', foo: 'bar' })
  })
})
