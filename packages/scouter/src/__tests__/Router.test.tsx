// oxlint-disable vitest/require-top-level-describe typescript/no-explicit-any
import { act, render, screen } from '@testing-library/react'
import { createMemoryHistory as createHistory } from 'history'
import { expect, test } from 'vitest'
import type { Location, Match } from '../index'
import { Route } from '../index'
import { Router } from '../Router'

test('renders children', () => {
  const text = 'Hello Router'

  const history = createHistory()

  render(
    <Router history={history}>
      <div>{text}</div>
    </Router>,
  )

  expect(screen.getByText(text)).toBeInTheDocument()
})

test('provides history to children', () => {
  let history: any

  const customHistory = createHistory()

  render(
    <Router history={customHistory}>
      <Route
        render={({ history: historyProps }) => {
          history = historyProps
          return null
        }}
      />
    </Router>,
  )

  expect(history).toBe(customHistory)
})

test('provides location to children', () => {
  let location: Location

  const history = createHistory({
    initialEntries: ['/test-location'],
  })

  render(
    <Router history={history}>
      <Route
        render={({ location: locationProps }) => {
          location = locationProps
          return null
        }}
      />
    </Router>,
  )

  expect(location!.pathname).toBe('/test-location')
})

test('updates when history changes', () => {
  let location: Location

  const history = createHistory({
    initialEntries: ['/initial'],
  })

  render(
    <Router history={history}>
      <Route
        render={({ location: locationProps }) => {
          location = locationProps
          return <div>{locationProps.pathname}</div>
        }}
      />
    </Router>,
  )

  expect(location!.pathname).toBe('/initial')

  act(() => {
    history.push('/updated')
  })

  expect(location!.pathname).toBe('/updated')
})

test('provides match to children', () => {
  let match: Match

  const history = createHistory()

  render(
    <Router history={history}>
      <Route
        render={({ match: propsMatch }) => {
          match = propsMatch
          return null
        }}
      />
    </Router>,
  )

  expect(match!).toBeDefined()
  expect(match!.params).toStrictEqual({})
})
