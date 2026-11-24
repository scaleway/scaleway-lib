// oxlint-disable vitest/require-top-level-describe
import { assert, expect, test } from 'vitest'
import { render, renderHook } from 'vitest-browser-react'
import type { Location, Match } from '../index'
import { MemoryRouter, Route, useHistory } from '../index'

test('renders children', async () => {
  const text = 'Hello MemoryRouter'

  const screen = await render(
    <MemoryRouter>
      <div>{text}</div>
    </MemoryRouter>,
  )

  expect(screen.getByText(text).element()).toBeDefined()
})

test('creates history with initialEntries', async () => {
  const initialEntries = ['/initial-path']
  let location: Partial<Location> = {}

  await render(
    <MemoryRouter initialEntries={initialEntries}>
      <Route
        path="/"
        render={({ location: locationProps }) => {
          location = locationProps
          return null
        }}
      />
    </MemoryRouter>,
  )

  assert.exists(location.pathname)
  expect(location.pathname).toBe('/initial-path')
})

test('creates history with initialIndex', async () => {
  const initialEntries = ['/first', '/second', '/third']
  const initialIndex = 1
  let location: Partial<Location> = {}

  await render(
    <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
      <Route
        path="/"
        render={({ location: locationProps }) => {
          location = locationProps
          return null
        }}
      />
    </MemoryRouter>,
  )

  assert.exists(location.pathname)
  expect(location.pathname).toBe('/second')
})

test('provides default initialEntries when not specified', async () => {
  let location: Partial<Location> = {}

  await render(
    <MemoryRouter>
      <Route
        path="/"
        render={({ location: locationProps }) => {
          location = locationProps
          return null
        }}
      />
    </MemoryRouter>,
  )

  assert.exists(location.pathname)
  expect(location.pathname).toBe('/')
})

test('history is stable across re-renders', async () => {
  const { result, rerender } = await renderHook(() => useHistory(), {
    wrapper: MemoryRouter,
  })

  const firstHistory = result.current
  await rerender()

  expect(result.current).toBe(firstHistory)
})

test('provides root route context', async () => {
  let match: Partial<Match> = {}

  await render(
    <MemoryRouter>
      <Route
        render={({ match: matchProps }) => {
          match = matchProps
          return null
        }}
      />
    </MemoryRouter>,
  )

  assert.exists(match.params)
  expect(match.params).toStrictEqual({})
})
