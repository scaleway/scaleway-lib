// @ts-expect-error TODO: remove once Growthbook is correctly typed and export
import { useGrowthBook } from '@growthbook/growthbook-react'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { renderHook } from '@testing-library/react'
import type { Attributes } from '../types'
import { useAbTestAttributes } from '../useAbTestAttributes'

jest.mock('@growthbook/growthbook-react', () => ({
  useGrowthBook: jest.fn(),
}))

describe('useAbTestAttributes', () => {
  let getAttributes: () => Attributes
  let setAttributes: (attributes: Attributes) => null | undefined

  beforeEach(() => {
    getAttributes = jest
      .fn()
      .mockReturnValue({ foo: 'bar' }) as () => Attributes
    setAttributes = jest.fn() as (attributes: Attributes) => null | undefined
    ;(useGrowthBook as jest.Mock).mockReturnValue({
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
