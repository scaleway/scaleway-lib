// oxlint-disable vitest/require-top-level-describe
import { createMemoryHistory as createHistory } from 'history'
import { useEffect } from 'react'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import { Route, Switch } from '../index'
import { Router } from '../Router'
import { act } from './utils/reactAct'

test('does not remount when switching between matching routes', async () => {
  const mountCalls: string[] = []
  const history = createHistory({ initialEntries: ['/hello'] })

  const PersistentComponent = ({ name }: { name: string }) => {
    useEffect(() => {
      mountCalls.push(`mount ${name}`)
    }, [name])

    return <div>Persistent</div>
  }

  await render(
    <Router history={history}>
      <Switch>
        <Route path="/hello" render={() => <PersistentComponent name="one" />} />
        <Route path="/world" render={() => <PersistentComponent name="two" />} />
      </Switch>
    </Router>,
  )

  expect(mountCalls).toStrictEqual(['mount one'])

  await act(() => {
    history.push('/hello/sub')
  })

  expect(mountCalls).toStrictEqual(['mount one'])

  await act(() => {
    history.push('/world')
  })

  expect(mountCalls).toStrictEqual(['mount one', 'mount two'])
})
