# `@scaleway/use-query-params`

## A tiny hooks to handle use-query-params

## Install

```bash
$ yarn add @scaleway/use-query-params
```

## Usage

```js
import React from 'react'
import useQueryParams from '@scaleway/use-query-params'

// this component should be wrap with a Router
const Component = () => {
  const { queryParams, setQueryParams } = useQueryParams()
  const { user } = queryParams
  const setUser = () => setQueryParams({ user: 'John' })
  // ?user=John

  return (
    <>
      <h1>User: {user}</h1>
      <button onClick={setUser}>Set User John</button>
    </>
  )
}
```

## Usage with a custom updater

```js
import React from 'react'
import useQueryParams from '@scaleway/use-query-params'

// this component should be wrap with a Router
const Component = () => {
  const updater = (prevState, nextState) => ({
    ...prevState,
    ...Object.keys(nextState).reduce(
      (acc, key) => ({ ...acc, [key]: nextState[key].toUpperCase() }),
      {},
    ),
  })
  const { queryParams, setQueryParams } = useQueryParams({ updater })
  const { user } = queryParams
  const setUser = () => setQueryParams({ user: 'John' })
  // ?user=JOHN

  return (
    <>
      <h1>User: {user}</h1>
      <button onClick={setUser}>Set User John</button>
    </>
  )
}
```
