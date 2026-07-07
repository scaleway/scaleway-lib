// oxlint-disable vitest/require-top-level-describe vitest/prefer-expect-assertions
import { act, render } from '@testing-library/react'
import { createMemoryHistory as createHistory } from 'history'
import { useEffect } from 'react'
import { expect, test } from 'vitest'
import { Route, Switch } from '../index'
import { Router } from '../Router'

test('does not remount when switching between matching routes', () => {
  const mountCalls: string[] = []
  const history = createHistory({ initialEntries: ['/hello'] })

  const PersistentComponent = ({ name }: { name: string }) => {
    useEffect(() => {
      mountCalls.push('mount ' + name)
    }, [name])

    return <div>Persistent</div>
  }

  render(
    <Router history={history}>
      <Switch>
        <Route path="/hello" render={() => <PersistentComponent name="one" />} />
        <Route path="/world" render={() => <PersistentComponent name="two" />} />
      </Switch>
    </Router>,
  )

  expect(mountCalls).toEqual(['mount one'])

  act(() => {
    history.push('/hello/sub')
  })

  expect(mountCalls).toEqual(['mount one'])

  act(() => {
    history.push('/world')
  })

  expect(mountCalls).toEqual(['mount one', 'mount two'])
})
