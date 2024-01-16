import * as growthbook from '@growthbook/growthbook-react'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { renderHook } from '@testing-library/react'
import type { Attributes } from '../types'
import { useAbTestAttributes } from '../useAbTestAttributes'

jest.mock('@growthbook/growthbook-react')

describe('useAbTestAttributes', () => {
  let getAttributes: () => Attributes
  let setAttributes: (attributes: Attributes) => Promise<void>

  beforeEach(() => {
    getAttributes = jest.fn<() => Attributes>().mockReturnValue({ foo: 'bar' })
    setAttributes = jest.fn(() => Promise.resolve())

    jest.spyOn(growthbook, 'useGrowthBook').mockReturnValue({
      getAttributes,
      setAttributes,
    } as ReturnType<typeof growthbook.useGrowthBook>)
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
