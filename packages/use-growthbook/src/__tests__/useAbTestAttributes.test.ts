import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  getAttributes,
  setAttributes,
  useGrowthBook,
} from '../../__mocks__/@growthbook/growthbook-react'
import { useAbTestAttributes } from '../useAbTestAttributes'

describe('useAbTestAttributes', () => {
  beforeEach(() => {
    getAttributes.mockReturnValue({ foo: 'bar' })

    useGrowthBook.mockReturnValue({
      getAttributes,
      setAttributes,
    })
  })

  it('should allow to get attributes from GrowthBook', () => {
    const {
      result: {
        current: [attributes],
      },
    } = renderHook(() => useAbTestAttributes())

    expect(getAttributes).toBeCalledTimes(1)
    expect(attributes).toEqual({ foo: 'bar' })
  })

  it('should allow to set Attributes through Growthbook', () => {
    const {
      result: {
        current: [, setAttributesNow],
      },
    } = renderHook(() => useAbTestAttributes())
    setAttributesNow({ bar: 'foo' })
    expect(setAttributes).toBeCalledTimes(1)
    expect(setAttributes).toBeCalledWith({ foo: 'bar', bar: 'foo' })
  })
})
