// oxlint-disable vitest/require-top-level-describe unicorn/no-negated-condition vitest/no-conditional-in-test
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import type { History, Location, Match } from '../index'
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
  let location: Location

  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Route
        path="/"
        render={props => {
          location = props.location
          return null
        }}
      />
    </MemoryRouter>,
  )

  expect(location!.pathname).toBe('/initial-path')
})

test('creates history with initialIndex', () => {
  const initialEntries = ['/first', '/second', '/third']
  const initialIndex = 1
  let location: Location

  render(
    <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
      <Route
        path="/"
        render={props => {
          location = props.location
          return null
        }}
      />
    </MemoryRouter>,
  )

  expect(location!.pathname).toBe('/second')
})

test('provides default initialEntries when not specified', () => {
  let location: Location

  render(
    <MemoryRouter>
      <Route
        path="/"
        render={props => {
          location = props.location
          return null
        }}
      />
    </MemoryRouter>,
  )

  expect(location!.pathname).toBe('/')
})

test('history is stable across re-renders', () => {
  let firstHistory: History
  let secondHistory: History

  const TestComponent = () => {
    const history = useHistory()
    if (!firstHistory) {
      firstHistory = history
    } else {
      secondHistory = history
    }
    return null
  }

  const page = render(
    <MemoryRouter>
      <TestComponent />
    </MemoryRouter>,
  )

  page.rerender(
    <MemoryRouter>
      <TestComponent />
    </MemoryRouter>,
  )

  expect(firstHistory!).toBe(secondHistory!)
})

test('provides root route context', () => {
  let match: Match

  render(
    <MemoryRouter>
      <Route
        render={props => {
          match = props.match
          return null
        }}
      />
    </MemoryRouter>,
  )

  expect(match!).toBeDefined()
  expect(match!.params).toEqual({})
})
