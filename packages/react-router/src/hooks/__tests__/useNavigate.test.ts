import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useNavigate } from '../useNavigate'

const mockHistoryReplace = vi.fn()
const mockHistoryPush = vi.fn()
vi.mock('react-router-dom', () => ({
  useHistory: vi.fn(() => ({
    replace: mockHistoryReplace,
    push: mockHistoryPush,
  })),
}))

describe('useNavigate', () => {
  it('should call history.push by default', () => {
    const { result } = renderHook(() => useNavigate())

    result.current('/root')
    expect(mockHistoryPush).toHaveBeenCalledWith('/root', undefined)
    expect(mockHistoryReplace).toHaveBeenCalledTimes(0)
  })

  it('should call history.replace if indicated', () => {
    const { result } = renderHook(() => useNavigate())

    result.current('/root', { replace: true })
    expect(mockHistoryReplace).toHaveBeenCalledWith('/root', undefined)
    expect(mockHistoryPush).toHaveBeenCalledTimes(0)
  })
})
