import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getAttributes,
  setAttributes,
  useGrowthBook,
} from '../../__mocks__/@growthbook/growthbook-react'
import { useAbTestAttributes } from '../useAbTestAttributes'

describe('useAbTestAttributes', () => {
  beforeEach(() => {
    getAttributes.mockReturnValue({ foo: 'bar' })
    setAttributes.mockResolvedValue(undefined)

    useGrowthBook.mockReturnValue({
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

    expect(getAttributes).toHaveBeenCalledOnce()
    expect(attributes).toEqual({ foo: 'bar' })
  })

  it('should allow to set Attributes through Growthbook', () => {
    const {
      result: {
        current: [, setAttributesNow],
      },
    } = renderHook(() => useAbTestAttributes())
    setAttributesNow({ bar: 'foo' })
    expect(setAttributes).toHaveBeenCalledOnce()
    expect(setAttributes).toBeCalledWith({ bar: 'foo', foo: 'bar' })
  })
})
