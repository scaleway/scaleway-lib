// oxlint-disable  vitest/require-top-level-describe max-statements vitest/no-conditional-in-test typescript/strict-void-return
import { act, render, renderHook, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { useEffect, useState } from 'react'
import { describe, expect, it, test } from 'vitest'
import { Link, MemoryRouter, Route, useBlockNavigation, useNavigate, useSafeQueryParams } from '../index'
import { Router } from '../Router'

describe('useBlockNavigation - renderHook tests', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <Route>{children}</Route>
    </MemoryRouter>
  )

  it('returns default values when not enabled', () => {
    const { result } = renderHook(() => useBlockNavigation(), { wrapper })

    expect(result.current.enabled).toBe(false)
    expect(result.current.hasPendingNavigation).toBe(false)
    expect(typeof result.current.setEnabled).toBe('function')
    expect(typeof result.current.continueNavigation).toBe('function')
    expect(typeof result.current.discardNavigation).toBe('function')
    expect(typeof result.current.unblockImmediatly).toBe('function')
  })

  it('continueNavigation does nothing when not enabled', () => {
    const { result } = renderHook(() => useBlockNavigation(), { wrapper })

    expect(() => {
      result.current.continueNavigation()
    }).not.toThrow()
  })

  it('continueNavigation does nothing when no pending navigation', () => {
    const { result } = renderHook(() => useBlockNavigation({ initialEnabled: true }), { wrapper })

    expect(() => {
      result.current.continueNavigation()
    }).not.toThrow()
  })

  it('discardNavigation does nothing when not enabled', () => {
    const { result } = renderHook(() => useBlockNavigation(), { wrapper })

    expect(() => {
      result.current.discardNavigation()
    }).not.toThrow()
  })

  it('discardNavigation does nothing when no pending navigation', () => {
    const { result } = renderHook(() => useBlockNavigation({ initialEnabled: true }), { wrapper })

    expect(() => {
      result.current.discardNavigation()
    }).not.toThrow()
  })

  it('unblockImmediatly allow to navigate right after', () => {
    const history = createMemoryHistory()
    const wrapper2 = ({ children }: { children: React.ReactNode }) => (
      <Router history={history}>
        <Route>{children}</Route>
      </Router>
    )

    const { result } = renderHook(() => useBlockNavigation({ enabled: true }), {
      wrapper: wrapper2,
    })

    // Unblock immediately
    act(() => {
      result.current.unblockImmediatly()
      // Navigation should now be allowed
      history.push('/another')
    })

    expect(history.location.pathname).toBe('/another')
  })

  it('returns enabled=true when initialEnabled=true', () => {
    const { result } = renderHook(() => useBlockNavigation({ initialEnabled: true }), { wrapper })

    expect(result.current.enabled).toBe(true)
    expect(result.current.hasPendingNavigation).toBe(false)
  })

  it('returns enabled=true when static enabled=true', () => {
    const { result } = renderHook(() => useBlockNavigation({ enabled: true }), { wrapper })

    expect(result.current.enabled).toBe(true)
  })

  it('static enabled takes precedence over dynamic enabled', () => {
    const { result } = renderHook(() => useBlockNavigation({ enabled: true, initialEnabled: false }), { wrapper })

    expect(result.current.enabled).toBe(true)
  })

  it('setEnabled updates dynamic enabled state', () => {
    const { result } = renderHook(() => useBlockNavigation({ initialEnabled: false }), { wrapper })

    expect(result.current.enabled).toBe(false)

    act(() => {
      result.current.setEnabled(true)
    })

    expect(result.current.enabled).toBe(true)
  })

  it('block navigation', () => {
    const history = createMemoryHistory()
    const wrapper2 = ({ children }: { children: React.ReactNode }) => (
      <Router history={history}>
        <Route>{children}</Route>
      </Router>
    )
    const { result, rerender } = renderHook(({ enabled }: { enabled: boolean }) => useBlockNavigation({ enabled }), {
      wrapper: wrapper2,
      initialProps: { enabled: true },
    })
    expect(result.current.enabled).toBe(true)
    expect(result.current.hasPendingNavigation).toBe(false)

    // try to navigate
    act(() => {
      history.push('/new')
    })

    expect(result.current.hasPendingNavigation).toBe(true)
    expect(history.location.pathname).toBe('/')

    // Discard navigation
    act(() => {
      result.current.discardNavigation()
    })

    expect(result.current.hasPendingNavigation).toBe(false)
    expect(history.location.pathname).toBe('/')

    // try to navigate again
    act(() => {
      history.push('/other')
    })

    expect(result.current.hasPendingNavigation).toBe(true)
    expect(history.location.pathname).toBe('/')

    // this time continue the nav
    act(() => {
      result.current.continueNavigation()
    })

    expect(result.current.hasPendingNavigation).toBe(false)
    expect(history.location.pathname).toBe('/other')

    // Unblock navigation
    rerender({ enabled: false })

    expect(result.current.enabled).toBe(false)

    // try to navigate
    act(() => {
      history.push('/final')
    })

    expect(result.current.hasPendingNavigation).toBe(false)
    expect(history.location.pathname).toBe('/final')
  })
})

test('form use case', async () => {
  let resolveSubmit: () => void = () => {}

  const UserForm = () => {
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
        <form onSubmit={handleSubmit}>
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

  const history = createMemoryHistory()
  render(
    <Router history={history}>
      <Route path="/" exact>
        <h1>Home</h1>
        <Link to="/form">Go to form</Link>
      </Route>
      <Route path="/form">
        <h1>Form</h1>
        <UserForm />
      </Route>
    </Router>,
  )

  expect(screen.getByRole('heading', { name: 'Home' })).toBeVisible()

  await userEvent.click(screen.getByRole('link', { name: 'Go to form' }))

  expect(screen.getByRole('heading', { name: 'Form' })).toBeVisible()

  // Try to go back home -> should work because not dirty
  await userEvent.click(screen.getByRole('link', { name: 'Go home' }))
  expect(screen.getByRole('heading', { name: 'Home' })).toBeVisible()

  // Go back to form
  await userEvent.click(screen.getByRole('link', { name: 'Go to form' }))
  expect(screen.getByRole('heading', { name: 'Form' })).toBeVisible()
  // Fill form
  await userEvent.type(screen.getByPlaceholderText('Name'), 'John')
  // Try to navigate
  await userEvent.click(screen.getByRole('link', { name: 'Go home' }))

  // Navigation should be blocked (test history.location.pathname is still /form)
  expect(history.location.pathname).toBe('/form')
  // "You have unsaved changes" should be visible
  expect(screen.getByText('You have unsaved changes')).toBeVisible()

  // Click "Keep editing"
  await userEvent.click(screen.getByRole('button', { name: 'Keep editing' }))

  // pathname is still /form
  expect(history.location.pathname).toBe('/form')
  // "You have unsaved changes" no longer visible
  expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument()

  // Try to navigate to home again
  await userEvent.click(screen.getByRole('link', { name: 'Go home' }))
  // This time click Confirm
  await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))

  // Check that we have navigated to home
  expect(screen.getByRole('heading', { name: 'Home' })).toBeVisible()

  // Go to form again
  await userEvent.click(screen.getByRole('link', { name: 'Go to form' }))
  expect(screen.getByRole('heading', { name: 'Form' })).toBeVisible()
  // Fill the form again
  await userEvent.type(screen.getByPlaceholderText('Name'), 'Jane')
  // Submit form
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }))

  // Test that form is submitting
  expect(screen.getByRole('button', { name: 'Submitting...' })).toBeVisible()

  // Try to navigate
  await userEvent.click(screen.getByRole('link', { name: 'Go home' }))

  // Nav should be blocked
  expect(history.location.pathname).toBe('/form')
  expect(screen.getByText('You have unsaved changes')).toBeVisible()

  // Call resolveSubmit to finish the submit
  act(() => {
    resolveSubmit()
  })

  // Check that the navigation worked and we are now on home page
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: 'Home' })).toBeVisible()
  })
})

test('form use case with useSafeQueryParams - query params update allowed but navigation blocked', async () => {
  const { z } = await import('zod')

  // oxlint-disable-next-line react/no-multi-comp
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
  render(
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

  expect(screen.getByRole('heading', { name: 'Home' })).toBeVisible()

  // Go to form
  await userEvent.click(screen.getByRole('link', { name: 'Go to form' }))
  expect(screen.getByRole('heading', { name: 'Form' })).toBeVisible()

  // Fill form - this should update query params without blocking
  await userEvent.type(screen.getByPlaceholderText('Name'), 'John')

  // Query params should be updated (check via location.search)
  expect(history.location.search).toContain('name=John')
  // But we should still be on /form
  expect(history.location.pathname).toBe('/form')
  // No pending navigation should be shown
  expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument()

  // Try to navigate to home - should be blocked because form is dirty
  await userEvent.click(screen.getByRole('link', { name: 'Go home' }))

  // Navigation should be blocked
  expect(history.location.pathname).toBe('/form')
  expect(screen.getByText('You have unsaved changes')).toBeVisible()

  // Click "Keep editing"
  await userEvent.click(screen.getByRole('button', { name: 'Keep editing' }))

  expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument()

  // Try to navigate to other page - should also be blocked
  await userEvent.click(screen.getByRole('link', { name: 'Go to other' }))

  expect(history.location.pathname).toBe('/form')
  expect(screen.getByText('You have unsaved changes')).toBeVisible()

  // Click "Confirm" to allow navigation
  await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))

  // Check that we have navigated to other page
  expect(screen.getByRole('heading', { name: 'Other' })).toBeVisible()
})
