import { createMemoryHistory } from 'history'
import { useEffect, useState } from 'react'
import { beforeAll, describe, expect, it, test } from 'vitest'
import { render, renderHook } from 'vitest-browser-react'
// oxlint-disable  vitest/require-top-level-describe vitest/no-conditional-in-test
import { userEvent } from 'vitest/browser'
import { Link, MemoryRouter, Route, useBlockNavigation, useNavigate, useSafeQueryParams } from '../index'
import { Router } from '../Router'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <Route>{children}</Route>
  </MemoryRouter>
)

describe('useBlockNavigation - renderHook tests', () => {
  it('returns default values when not enabled', async () => {
    const { result } = await renderHook(() => useBlockNavigation(), { wrapper })

    expect(result.current.enabled).toBe(false)
    expect(result.current.hasPendingNavigation).toBe(false)
    expect(result.current.setEnabled).toBeTypeOf('function')
    expect(result.current.continueNavigation).toBeTypeOf('function')
    expect(result.current.discardNavigation).toBeTypeOf('function')
    expect(result.current.unblockImmediatly).toBeTypeOf('function')
  })

  it('continueNavigation does nothing when not enabled', async () => {
    const { result } = await renderHook(() => useBlockNavigation(), { wrapper })

    expect(() => {
      result.current.continueNavigation()
    }).not.toThrow()
  })

  it('continueNavigation does nothing when no pending navigation', async () => {
    const { result } = await renderHook(() => useBlockNavigation({ initialEnabled: true }), { wrapper })

    expect(() => {
      result.current.continueNavigation()
    }).not.toThrow()
  })

  it('discardNavigation does nothing when not enabled', async () => {
    const { result } = await renderHook(() => useBlockNavigation(), { wrapper })

    expect(() => {
      result.current.discardNavigation()
    }).not.toThrow()
  })

  it('discardNavigation does nothing when no pending navigation', async () => {
    const { result } = await renderHook(() => useBlockNavigation({ initialEnabled: true }), { wrapper })

    expect(() => {
      result.current.discardNavigation()
    }).not.toThrow()
  })

  it('unblockImmediatly allow to navigate right after', async () => {
    const history = createMemoryHistory()
    const wrapper2 = ({ children }: { children: React.ReactNode }) => (
      <Router history={history}>
        <Route>{children}</Route>
      </Router>
    )

    const { result, act } = await renderHook(() => useBlockNavigation({ enabled: true }), {
      wrapper: wrapper2,
    })

    // Unblock immediately
    await act(() => {
      result.current.unblockImmediatly()
      // Navigation should now be allowed
      history.push('/another')
    })

    expect(history.location.pathname).toBe('/another')
  })

  it('returns enabled=true when initialEnabled=true', async () => {
    const { result } = await renderHook(() => useBlockNavigation({ initialEnabled: true }), { wrapper })

    expect(result.current.enabled).toBe(true)
    expect(result.current.hasPendingNavigation).toBe(false)
  })

  it('returns enabled=true when static enabled=true', async () => {
    const { result } = await renderHook(() => useBlockNavigation({ enabled: true }), { wrapper })

    expect(result.current.enabled).toBe(true)
  })

  it('static enabled takes precedence over dynamic enabled', async () => {
    const { result } = await renderHook(() => useBlockNavigation({ enabled: true, initialEnabled: false }), {
      wrapper,
    })

    expect(result.current.enabled).toBe(true)
  })

  it('setEnabled updates dynamic enabled state', async () => {
    const { result, act } = await renderHook(() => useBlockNavigation({ initialEnabled: false }), { wrapper })

    expect(result.current.enabled).toBe(false)

    await act(() => {
      result.current.setEnabled(true)
    })

    expect(result.current.enabled).toBe(true)
  })

  it('block navigation', async () => {
    const history = createMemoryHistory()
    const wrapper2 = ({ children }: { children: React.ReactNode }) => (
      <Router history={history}>
        <Route>{children}</Route>
      </Router>
    )
    const initialProps = { enabled: true }
    const { result, rerender, act } = await renderHook(
      (props: typeof initialProps = initialProps) => useBlockNavigation({ enabled: props.enabled }),
      {
        wrapper: wrapper2,
        initialProps,
      },
    )
    expect(result.current.enabled).toBe(true)
    expect(result.current.hasPendingNavigation).toBe(false)

    // try to navigate
    await act(() => {
      history.push('/new')
    })

    expect(result.current.hasPendingNavigation).toBe(true)
    expect(history.location.pathname).toBe('/')

    // Discard navigation
    await act(() => {
      result.current.discardNavigation()
    })

    expect(result.current.hasPendingNavigation).toBe(false)
    expect(history.location.pathname).toBe('/')

    // try to navigate again
    await act(() => {
      history.push('/other')
    })

    expect(result.current.hasPendingNavigation).toBe(true)
    expect(history.location.pathname).toBe('/')

    // this time continue the nav
    await act(() => {
      result.current.continueNavigation()
    })

    expect(result.current.hasPendingNavigation).toBe(false)
    expect(history.location.pathname).toBe('/other')

    // Unblock navigation
    await rerender({ enabled: false })

    expect(result.current.enabled).toBe(false)

    // try to navigate
    await act(() => {
      history.push('/final')
    })

    expect(result.current.hasPendingNavigation).toBe(false)
    expect(history.location.pathname).toBe('/final')
  })
})

let resolveSubmit: (() => void) | undefined = undefined

const BlockNavigationForm = () => {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isDirty = name !== ''

  const navigate = useNavigate()

  const { hasPendingNavigation, continueNavigation, discardNavigation, unblockImmediatly } = useBlockNavigation({
    enabled: isDirty,
  })

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise<void>(r => {
      resolveSubmit = r
    })
    setSubmitting(false)

    unblockImmediatly()
    navigate('/')
  }

  return (
    <div>
      <Link to="/">Go home</Link>
      <form
        onSubmit={(e: React.SubmitEvent) => {
          handleSubmit(e).catch(() => undefined)
        }}
      >
        <input
          name="name"
          type="text"
          value={name}
          onChange={e => {
            setName(e.target.value)
          }}
          placeholder="Name"
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {hasPendingNavigation && (
        <div>
          <span>You have unsaved changes</span>
          <button type="button" onClick={discardNavigation}>
            Keep editing
          </button>
          <button type="button" onClick={continueNavigation}>
            Confirm
          </button>
        </div>
      )}
    </div>
  )
}

test('form use case', async () => {
  beforeAll(() => {
    resolveSubmit = () => undefined
  })

  const history = createMemoryHistory()
  const screen = await render(
    <Router history={history}>
      <Route path="/" exact>
        <h1>Home</h1>
        <Link to="/form">Go to form</Link>
      </Route>
      <Route path="/form">
        <h1>Form</h1>
        <BlockNavigationForm />
      </Route>
    </Router>,
  )

  await expect.element(screen.getByRole('heading', { name: 'Home' })).toBeVisible()

  await screen.getByRole('link', { name: 'Go to form' }).click()

  await expect.element(screen.getByRole('heading', { name: 'Form' })).toBeVisible()

  // Try to go back home -> should work because not dirty
  await screen.getByRole('link', { name: 'Go home' }).click()
  await expect.element(screen.getByRole('heading', { name: 'Home' })).toBeVisible()

  // Go back to form
  await screen.getByRole('link', { name: 'Go to form' }).click()
  await expect.element(screen.getByRole('heading', { name: 'Form' })).toBeVisible()
  // Fill form
  await userEvent.type(screen.getByPlaceholder('Name'), 'John')
  // Try to navigate
  await screen.getByRole('link', { name: 'Go home' }).click()

  // Navigation should be blocked (test history.location.pathname is still /form)
  expect(history.location.pathname).toBe('/form')
  // "You have unsaved changes" should be visible
  await expect.element(screen.getByText('You have unsaved changes')).toBeVisible()

  // Click "Keep editing"
  await screen.getByRole('button', { name: 'Keep editing' }).click()

  // pathname is still /form
  expect(history.location.pathname).toBe('/form')
  // "You have unsaved changes" no longer visible
  expect(screen.getByText('You have unsaved changes').query()).toBeNull()

  // Try to navigate to home again
  await screen.getByRole('link', { name: 'Go home' }).click()
  // This time click Confirm
  await screen.getByRole('button', { name: 'Confirm' }).click()

  // Check that we have navigated to home
  await expect.element(screen.getByRole('heading', { name: 'Home' })).toBeVisible()

  // Go to form again
  await screen.getByRole('link', { name: 'Go to form' }).click()
  await expect.element(screen.getByRole('heading', { name: 'Form' })).toBeVisible()
  // Fill the form again
  await userEvent.type(screen.getByPlaceholder('Name'), 'Jane')
  // Submit form
  await screen.getByRole('button', { name: 'Submit' }).click()

  // Test that form is submitting
  await expect.element(screen.getByRole('button', { name: 'Submitting...' })).toBeVisible()

  // Try to navigate
  await screen.getByRole('link', { name: 'Go home' }).click()

  // Nav should be blocked
  expect(history.location.pathname).toBe('/form')
  await expect.element(screen.getByText('You have unsaved changes')).toBeVisible()

  // Call resolveSubmit to finish the submit. Called outside act on purpose:
  // with the act environment off, React processes the pending microtask chain
  // without "not wrapped in act" noise, and the assertion below auto-retries.
  resolveSubmit?.()

  // Check that the navigation worked and we are now on home page
  await expect.element(screen.getByRole('heading', { name: 'Home' })).toBeVisible()
})

test(
  'form use case with useSafeQueryParams - query params update allowed but navigation blocked',
  { retry: 3 },
  async () => {
    const { z } = await import('zod')

    const UserForm = () => {
      const { setQueryParams, queryParams } = useSafeQueryParams({
        schema: z.object({
          name: z.string().optional(),
        }),
      })

      const [name, setName] = useState(queryParams.name)

      useEffect(() => {
        setQueryParams({ name })
      }, [name, setQueryParams])

      const isDirty = name !== ''

      const { hasPendingNavigation, continueNavigation, discardNavigation } = useBlockNavigation({
        enabled: isDirty,
      })

      const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setName(newValue)
        setQueryParams({ name: newValue || undefined })
      }

      return (
        <div>
          <Link to="/">Go home</Link>
          <Link to="/other">Go to other</Link>
          <form>
            <input name="name" type="text" value={name} onChange={handleNameChange} placeholder="Name" />
          </form>
          {hasPendingNavigation && (
            <div>
              <span>You have unsaved changes</span>
              <button type="button" onClick={discardNavigation}>
                Keep editing
              </button>
              <button type="button" onClick={continueNavigation}>
                Confirm
              </button>
            </div>
          )}
        </div>
      )
    }

    const history = createMemoryHistory()
    const screen = await render(
      <Router history={history}>
        <Route path="/" exact>
          <h1>Home</h1>
          <Link to="/form">Go to form</Link>
        </Route>
        <Route path="/other">
          <h1>Other</h1>
          <Link to="/form">Go to form</Link>
        </Route>
        <Route path="/form">
          <h1>Form</h1>
          <UserForm />
        </Route>
      </Router>,
    )

    await expect.element(screen.getByRole('heading', { name: 'Home' })).toBeVisible()

    // Go to form
    await screen.getByRole('link', { name: 'Go to form' }).click()
    await expect.element(screen.getByRole('heading', { name: 'Form' })).toBeVisible()

    // Fill form - this should update query params without blocking
    await userEvent.type(screen.getByPlaceholder('Name'), 'John')

    // Query params should be updated (check via location.search)
    expect(history.location.search).toContain('name=John')
    // But we should still be on /form
    expect(history.location.pathname).toBe('/form')
    // No pending navigation should be shown
    expect(screen.getByText('You have unsaved changes').query()).toBeNull()

    // Try to navigate to home - should be blocked because form is dirty
    await screen.getByRole('link', { name: 'Go home' }).click()

    // Navigation should be blocked
    expect(history.location.pathname).toBe('/form')
    await expect.element(screen.getByText('You have unsaved changes')).toBeVisible()

    // Click "Keep editing"
    await screen.getByRole('button', { name: 'Keep editing' }).click()

    expect(screen.getByText('You have unsaved changes').query()).toBeNull()

    // Try to navigate to other page - should also be blocked
    await screen.getByRole('link', { name: 'Go to other' }).click()

    expect(history.location.pathname).toBe('/form')
    await expect.element(screen.getByText('You have unsaved changes')).toBeVisible()

    // Click "Confirm" to allow navigation
    await screen.getByRole('button', { name: 'Confirm' }).click()

    // Check that we have navigated to other page
    await expect.element(screen.getByRole('heading', { name: 'Other' })).toBeVisible()
  },
)
