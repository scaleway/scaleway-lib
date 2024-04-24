import { renderHook } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import useRandomName from '..'

describe('useRandomName', () => {
  beforeAll(() => {
    vi.spyOn(global.Math, 'random').mockReturnValue(0.4155913669444804)
  })

  afterAll(() => {
    vi.spyOn(global.Math, 'random').mockRestore()
  })

  it('useTranslation should not be defined without I18nProvider', () => {
    const { result } = renderHook(() => useRandomName())
    expect(result.current).toMatchSnapshot()
  })
})
