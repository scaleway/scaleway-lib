import { renderHook } from '@testing-library/react-hooks'
import { useMedia } from '..'

describe('useMedia hook', () => {
  it('useMedia should return the result of a query with a string', () => {
    const { result } = renderHook(() =>
      useMedia('screen and (min-width: 1000px)'),
    )

    expect(result.current).toBe(false)
  })
})
