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

### Set query params

Merge current query params with the new ones passed in parameters.

```js
//In this exemple we admit that we have an URL that include : `?compagny=Scaleway".
import React from 'react'
import useQueryParams from '@scaleway/use-query-params'

// this component should be wrap with a Router
const Component = () => {
  const { queryParams, setQueryParams } = useQueryParams()
  const { user, compagny } = queryParams // user will be undefined and compagny will be "Scaleway"
  const setUser = () => setQueryParams({ user: 'John' }) // user will be "John" and compagny will be "Scaleway"
  // ?compagny=Scaleway&user=John

  return (
    <>
      <h1>User: {user}</h1>
      <h1>Compagny: {compagny}</h1>
      <button onClick={setUser}>Set User John</button>
    </>
  )
}
```

### Replace query params

Erase current query params and replace by the new ones passed in parameters.

```js
//In this exemple we admit that we have an URL that include : `?compagny=Scaleway".
import React from 'react'
import useQueryParams from '@scaleway/use-query-params'

// this component should be wrap with a Router
const Component = () => {
  const { queryParams, setQueryParams } = useQueryParams()
  const { user, compagny } = queryParams // user will be undefined and compagny will be "Scaleway"
  const setUser = () => replaceQueryParams({ user: 'John' }) // user will be "John" and compagny will be undefined
  // ?user=John

  return (
    <>
      <h1>User: {user}</h1>
      <h1>Compagny: {compagny}</h1>
      <button onClick={setUser}>Set User John</button>
    </>
  )
}
```
