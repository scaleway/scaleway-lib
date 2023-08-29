import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals'
import { renderHook } from '@testing-library/react'
import useRandomName from '..'

describe('useRandomName', () => {
  beforeAll(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.4155913669444804)
  })

  afterAll(() => {
    jest.spyOn(global.Math, 'random').mockRestore()
  })

  it('useTranslation should not be defined without I18nProvider', () => {
    const { result } = renderHook(() => useRandomName())
    expect(result.current).toMatchSnapshot()
  })
})
