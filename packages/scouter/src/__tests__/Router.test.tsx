// oxlint-disable vitest/require-top-level-describe typescript/no-explicit-any
import { createMemoryHistory as createHistory } from 'history'
import { assert, expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import type { Location, Match } from '../index'
import { Route } from '../index'
import { Router } from '../Router'
import { act } from './utils/reactAct'

test('renders children', async () => {
  const text = 'Hello Router'

  const history = createHistory()

  const screen = await render(
    <Router history={history}>
      <div>{text}</div>
    </Router>,
  )

  expect(screen.getByText(text).element()).toBeDefined()
})

test('provides history to children', async () => {
  let history: any = undefined

  const customHistory = createHistory()

  await render(
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

test('provides location to children', async () => {
  let location: Partial<Location> = {}

  const history = createHistory({
    initialEntries: ['/test-location'],
  })

  await render(
    <Router history={history}>
      <Route
        render={({ location: locationProps }) => {
          location = locationProps
          return null
        }}
      />
    </Router>,
  )

  assert.exists(location)
  expect(location.pathname).toBe('/test-location')
})

test('updates when history changes', async () => {
  let location: Partial<Location> = {}

  const history = createHistory({
    initialEntries: ['/initial'],
  })

  await render(
    <Router history={history}>
      <Route
        render={({ location: locationProps }) => {
          location = locationProps
          return <div>{locationProps.pathname}</div>
        }}
      />
    </Router>,
  )

  assert.exists(location)
  expect(location.pathname).toBe('/initial')

  await act(() => {
    history.push('/updated')
  })

  expect(location.pathname).toBe('/updated')
})

test('provides match to children', async () => {
  let match: Partial<Match> = {}

  const history = createHistory()

  await render(
    <Router history={history}>
      <Route
        render={({ match: propsMatch }) => {
          match = propsMatch
          return null
        }}
      />
    </Router>,
  )

  assert.exists(match)
  expect(match).toBeDefined()
  expect(match.params).toStrictEqual({})
})
