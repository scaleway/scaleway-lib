// require-unicode-regexp's `v` flag breaks the browser locator selector engine
// oxlint-disable vitest/require-top-level-describe require-unicode-regexp
import type { ForwardedRef, HTMLAttributes } from 'react'
import React from 'react'
import { assert, expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import { Link, MemoryRouter, Route } from '../index'

test('renders anchor tag with correct href', async () => {
  const screen = await render(
    <MemoryRouter initialEntries={['/initial']}>
      <Link to="/target">Click me</Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /click me/i }).element()
  assert.exists(a)
  expect(a.getAttribute('href')).toBe('/target')
})

test('with to string', async () => {
  const screen = await render(
    <MemoryRouter>
      <Link to="/path">Link</Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/i }).element()
  assert.exists(a)
  expect(a.getAttribute('href')).toBe('/path')
})

test('with to object', async () => {
  const screen = await render(
    <MemoryRouter>
      <Link to={{ pathname: '/path', search: '?foo=bar', hash: '#section' }}>Link</Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/i }).element()
  assert.exists(a)
  expect(a.getAttribute('href')).toBe('/path?foo=bar#section')
})

test('with replace=true', async () => {
  let clicked = false

  const screen = await render(
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

  await screen.getByRole('link', { name: /link/i }).click()

  expect(clicked).toBe(true)
})

test('with component prop', async () => {
  const CustomComponent = React.forwardRef(
    (props: HTMLAttributes<HTMLAnchorElement>, ref: ForwardedRef<HTMLAnchorElement>) => (
      // oxlint-disable-next-line jsx-a11y/anchor-has-content
      <a ref={ref} {...props} data-custom="true" />
    ),
  )

  const screen = await render(
    <MemoryRouter>
      <Link to="/path" component={CustomComponent}>
        Link
      </Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/i }).element()
  expect(a.dataset['custom']).toBe('true')
  expect(a.getAttribute('href')).toBe('/path')
})

test('onClick handler prevents default and navigates', async () => {
  let navigateCalled = false

  const screen = await render(
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

  await screen.getByRole('link', { name: /link/i }).click()

  expect(navigateCalled).toBe(true)
})

test('onClick with modifier keys does not prevent default', async () => {
  const screen = await render(
    <MemoryRouter>
      <Link to="/target">Link</Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/i }).element()
  const event = new MouseEvent('click', {
    button: 0,
    ctrlKey: true,
    bubbles: true,
    cancelable: true,
  })

  assert.exists(a)
  // unhandled default action would navigate the real test iframe in chromium
  a.removeAttribute('href')
  const defaultPrevented = !a.dispatchEvent(event)
  expect(defaultPrevented).toBe(false)
})

test('onClick with target="_blank" does not prevent default', async () => {
  const screen = await render(
    <MemoryRouter>
      <Link to="/target" target="_blank">
        Link
      </Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/i }).element()
  const event = new MouseEvent('click', {
    button: 0,
    bubbles: true,
    cancelable: true,
  })

  assert.exists(a)
  // unhandled default action would navigate the real test iframe in chromium
  a.removeAttribute('href')
  const defaultPrevented = !a.dispatchEvent(event)
  expect(defaultPrevented).toBe(false)
})

test('onClick with event.defaultPrevented does not navigate', async () => {
  let navigateCalled = false

  const screen = await render(
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

  await screen.getByRole('link', { name: /link/i }).click()

  expect(navigateCalled).toBe(false)
})

test('forwards ref correctly', async () => {
  const ref = React.createRef<HTMLAnchorElement>()

  await render(
    <MemoryRouter>
      <Link to="/path" ref={ref}>
        Link
      </Link>
    </MemoryRouter>,
  )

  expect(ref.current).toBeDefined()
  expect(ref.current?.tagName).toBe('A')
})

test('passes through other anchor props', async () => {
  const screen = await render(
    <MemoryRouter>
      <Link to="/path" className="custom-class" id="custom-id" title="Custom title" data-test="value">
        Link
      </Link>
    </MemoryRouter>,
  )

  const a = screen.getByRole('link', { name: /link/i }).element()
  expect(a.className).toBe('custom-class')
  expect(a.id).toBe('custom-id')
  expect(a.getAttribute('title')).toBe('Custom title')
  expect(a.dataset['test']).toBe('value')
})

test('with non-left click does not navigate', async () => {
  let navigateCalled = false

  const screen = await render(
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

  const a = screen.getByRole('link', { name: /link/i }).element()
  const event = new MouseEvent('click', {
    button: 1, // middle click
    bubbles: true,
    cancelable: true,
  })

  assert.exists(a)
  // unhandled default action would navigate the real test iframe in chromium
  a.removeAttribute('href')
  a.dispatchEvent(event)

  expect(navigateCalled).toBe(false)
})
