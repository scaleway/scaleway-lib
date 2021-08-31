# `@scaleway/use-query-params`

## A tiny hooks to handle use-query-params

## Install

```bash
$ yarn add @scaleway/use-query-params react-router-dom
```

## Usage
```js
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from "react-router-dom";
import useQueryParams from '@scaleway/use-query-params'

const App = () => {
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

render(
  <Router>
    <App />
  </Router>,
  document.getElementById('react-root'),
)
```

### Set query params

Merge current query params with the new ones passed in parameters.

```js
// In this exemple we assume that we have an URL that include : `?company=Scaleway".
import React from 'react'
import useQueryParams from '@scaleway/use-query-params'

const Component = () => {
  const { queryParams, setQueryParams } = useQueryParams()
  const { user, company } = queryParams // user will be undefined and company will be "Scaleway"
  const setUser = () => setQueryParams({ user: 'John' }) // user will be "John" and company will be "Scaleway"
  // ?company=Scaleway&user=John

  return (
    <>
      <h1>User: {user}</h1>
      <h1>Company: {company}</h1>
      <button onClick={setUser}>Set User John</button>
    </>
  )
}
```

### Replace query params

Erase current query params and replace by the new ones passed in parameters.

```js
// In this exemple we assume that we have an URL that include : `?company=Scaleway".
import React from 'react'
import useQueryParams from '@scaleway/use-query-params'

const Component = () => {
  const { queryParams, setQueryParams } = useQueryParams()
  const { user, company } = queryParams // user will be undefined and company will be "Scaleway"
  const setUser = () => replaceQueryParams({ user: 'John' }) // user will be "John" and company will be undefined
  // ?user=John

  return (
    <>
      <h1>User: {user}</h1>
      <h1>Company: {company}</h1>
      <button onClick={setUser}>Set User John</button>
    </>
  )
}
```

### Push onto the stack instead of replacing

To avoid mutating history

```js
// In this exemple we assume that we have an URL that include : `?company=Scaleway".
import React from 'react'
import useQueryParams from '@scaleway/use-query-params'

const Component = () => {
  const { queryParams, setQueryParams } = useQueryParams()
  const { user, company } = queryParams // user will be undefined and company will be "Scaleway"
  const setUser = () => replaceQueryParams({ user: 'John' }, { push: true }) // user will be "John" and company will be undefined
  // ?user=John

  return (
    <>
      <h1>User: {user}</h1>
      <h1>Company: {company}</h1>
      <button onClick={setUser}>Set User John</button>
    </>
  )
}
```
