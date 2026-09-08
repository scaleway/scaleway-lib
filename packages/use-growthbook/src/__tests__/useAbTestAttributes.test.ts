import { getAttributes, setAttributes, useGrowthBook } from '@growthbook/growthbook-react'
import type { MockGrowthBook } from '@growthbook/growthbook-react'
import { renderHook } from '@testing-library/react'
import type { Mock } from 'vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAbTestAttributes } from '../useAbTestAttributes'

const mockUseGrowthBook = vi.mocked(useGrowthBook) as unknown as Mock<() => MockGrowthBook>

describe(useAbTestAttributes, () => {
  beforeEach(() => {
    getAttributes.mockReturnValue({ foo: 'bar' })
    setAttributes.mockResolvedValue(undefined)

    mockUseGrowthBook.mockReturnValue({
      getAttributes,
      init: vi.fn(),
      loadFeatures: vi.fn(),
      setAttributes,
    })
  })

  it('should allow to get attributes from GrowthBook', () => {
    const {
      result: {
        current: [attributes],
      },
    } = renderHook(() => useAbTestAttributes())

    expect(getAttributes).toHaveBeenCalledTimes(1)
    expect(attributes).toStrictEqual({ foo: 'bar' })
  })

  it('should allow to set Attributes through Growthbook', () => {
    const {
      result: {
        current: [, setAttributesNow],
      },
    } = renderHook(() => useAbTestAttributes())
    setAttributesNow({ bar: 'foo' })
    expect(setAttributes).toHaveBeenCalledTimes(1)
    expect(setAttributes).toHaveBeenCalledWith({ bar: 'foo', foo: 'bar' })
  })
})
