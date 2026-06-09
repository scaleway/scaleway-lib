import { act, renderHook, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MemoryRouter, Route, useHistory } from 'react-router-dom'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { useOnLeave } from '../useOnLeave'

const TestComponent = ({ children }: { children: React.ReactNode }) => {
  const history = useHistory()
  useOnLeave()

  return (
    <div>
      {children}
      <button
        onClick={() => {
          history.push('/new-page')
        }}
        type="button"
      >
        Navigate
      </button>
      <span data-testid="current-path">{history.location.pathname}</span>
    </div>
  )
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={['/']}>
    <Route path="*">
      <TestComponent>{children}</TestComponent>
    </Route>
  </MemoryRouter>
)

describe('useonleave', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useOnLeave(), { wrapper })
    expect(result.current.isConfirmationRequired).toBe(false)
    expectTypeOf(result.current.setIsConfirmationRequired).toBeFunction()
    expectTypeOf(result.current.allowNavigation).toBeFunction()
  })

  it('should block navigation when isconfirmationrequired is true', async () => {
    const { result } = renderHook(() => useOnLeave(), { wrapper })

    act(() => {
      result.current.setIsConfirmationRequired(true)
    })
    act(() => {
      result.current.allowNavigation(false)
    })
    await userEvent.click(screen.getByText('Navigate'))

    const pathname = screen.getByTestId('current-path').textContent
    expect(pathname).toBe('/')
  })

  it('should allow navigation when allownavigation is called', async () => {
    const { result } = renderHook(() => useOnLeave(), { wrapper })

    act(() => {
      result.current.setIsConfirmationRequired(true)
    })

    await userEvent.click(screen.getByText('Navigate'))

    const pathname = screen.getByTestId('current-path').textContent
    expect(pathname).toBe('/new-page')
  })
})
