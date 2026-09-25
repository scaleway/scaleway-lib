// oxlint-disable vitest/require-top-level-describe
import { render, renderHook, screen } from '@testing-library/react'
import { assert, expect, test } from 'vitest'
import type { Location, Match } from '../index'
import { MemoryRouter, Route, useHistory } from '../index'

test('renders children', () => {
  const text = 'Hello MemoryRouter'

  render(
    <MemoryRouter>
      <div>{text}</div>
    </MemoryRouter>,
  )

  expect(screen.getByText(text)).toBeInTheDocument()
})

test('creates history with initialEntries', () => {
  const initialEntries = ['/initial-path']
  let location: Partial<Location> = {}

  render(
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

test('creates history with initialIndex', () => {
  const initialEntries = ['/first', '/second', '/third']
  const initialIndex = 1
  let location: Partial<Location> = {}

  render(
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

test('provides default initialEntries when not specified', () => {
  let location: Partial<Location> = {}

  render(
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

test('history is stable across re-renders', () => {
  const { result, rerender } = renderHook(() => useHistory(), {
    wrapper: MemoryRouter,
  })

  const firstHistory = result.current
  rerender()

  expect(result.current).toBe(firstHistory)
})

test('provides root route context', () => {
  let match: Partial<Match> = {}

  render(
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
