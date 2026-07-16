// oxlint-disable vitest/require-top-level-describe
import { act, render, screen } from '@testing-library/react'
import type { ForwardedRef, HTMLAttributes } from 'react'
import React from 'react'
import { expect, test } from 'vitest'
import { Link, MemoryRouter, Route } from '../index'

test('renders anchor tag with correct href', () => {
  render(
    <MemoryRouter initialEntries={['/initial']}>
      <Link to="/target">Click me</Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /click me/iu })
  expect(a).toBeDefined()
  expect(a?.getAttribute('href')).toBe('/target')
})

test('with to string', () => {
  render(
    <MemoryRouter>
      <Link to="/path">Link</Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/iu })
  expect(a?.getAttribute('href')).toBe('/path')
})

test('with to object', () => {
  render(
    <MemoryRouter>
      <Link to={{ pathname: '/path', search: '?foo=bar', hash: '#section' }}>Link</Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/iu })
  expect(a?.getAttribute('href')).toBe('/path?foo=bar#section')
})

test('with replace=true', () => {
  let clicked = false

  render(
    <MemoryRouter initialEntries={['/initial']}>
      <Link
        to="/target"
        replace
        onClick={e => {
          e.preventDefault()
          clicked = true
        }}
      >
        Link
      </Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/iu })
  a?.click()

  expect(clicked).toBe(true)
})

test('with component prop', () => {
  const CustomComponent = React.forwardRef(
    (props: HTMLAttributes<HTMLAnchorElement>, ref: ForwardedRef<HTMLAnchorElement>) => (
      // oxlint-disable-next-line jsx-a11y/anchor-has-content
      <a ref={ref} {...props} data-custom="true" />
    ),
  )

  render(
    <MemoryRouter>
      <Link to="/path" component={CustomComponent}>
        Link
      </Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/iu })
  expect(a?.getAttribute('data-custom')).toBe('true')
  expect(a?.getAttribute('href')).toBe('/path')
})

test('onClick handler prevents default and navigates', () => {
  let navigateCalled = false

  render(
    <MemoryRouter initialEntries={['/initial']}>
      <Route
        render={({ history }) => {
          // oxlint-disable-next-line typescript/unbound-method
          const originalPush = history.push
          history.push = () => {
            navigateCalled = true
            originalPush.call(history, '/initial')
          }
          return <Link to="/target">Link</Link>
        }}
      />
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/iu })
  act(() => {
    a?.click()
  })

  expect(navigateCalled).toBe(true)
})

test('onClick with modifier keys does not prevent default', () => {
  render(
    <MemoryRouter>
      <Link to="/target">Link</Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/iu })
  const event = new MouseEvent('click', {
    button: 0,
    ctrlKey: true,
    bubbles: true,
    cancelable: true,
  })

  const defaultPrevented = !a?.dispatchEvent(event)
  expect(defaultPrevented).toBe(false)
})

test('onClick with target="_blank" does not prevent default', () => {
  render(
    <MemoryRouter>
      <Link to="/target" target="_blank">
        Link
      </Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/iu })
  const event = new MouseEvent('click', {
    button: 0,
    bubbles: true,
    cancelable: true,
  })

  const defaultPrevented = !a?.dispatchEvent(event)
  expect(defaultPrevented).toBe(false)
})

test('onClick with event.defaultPrevented does not navigate', () => {
  let navigateCalled = false

  render(
    <MemoryRouter initialEntries={['/initial']}>
      <Route
        render={({ history }) => {
          // oxlint-disable-next-line typescript/unbound-method
          const originalPush = history.push
          history.push = () => {
            navigateCalled = true
            originalPush.call(history, '/initial')
          }
          return (
            <Link to="/target" onClick={e => e.preventDefault()}>
              Link
            </Link>
          )
        }}
      />
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/iu })
  a?.click()

  expect(navigateCalled).toBe(false)
})

test('forwards ref correctly', () => {
  const ref = React.createRef<HTMLAnchorElement>()

  render(
    <MemoryRouter>
      <Link to="/path" ref={ref}>
        Link
      </Link>
    </MemoryRouter>,
  )

  expect(ref.current).toBeDefined()
  expect(ref.current?.tagName).toBe('A')
})

test('passes through other anchor props', () => {
  render(
    <MemoryRouter>
      <Link to="/path" className="custom-class" id="custom-id" title="Custom title" data-test="value">
        Link
      </Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/iu })
  expect(a?.className).toBe('custom-class')
  expect(a?.id).toBe('custom-id')
  expect(a?.title).toBe('Custom title')
  expect(a?.getAttribute('data-test')).toBe('value')
})

test('with non-left click does not navigate', () => {
  let navigateCalled = false

  render(
    <MemoryRouter initialEntries={['/initial']}>
      <Route
        render={({ history }) => {
          // oxlint-disable-next-line typescript/unbound-method
          const originalPush = history.push
          history.push = () => {
            navigateCalled = true
            originalPush.call(history, '/initial')
          }
          return <Link to="/target">Link</Link>
        }}
      />
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/iu })
  const event = new MouseEvent('click', {
    button: 1, // middle click
    bubbles: true,
    cancelable: true,
  })

  a?.dispatchEvent(event)

  expect(navigateCalled).toBe(false)
})
