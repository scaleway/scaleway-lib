# @scaleway/scouter

A router for React apps, forked from [react-router](https://github.com/remix-run/react-router) v5 with extra helpers and hooks.
The name comes from **sc**aleway + r**outer**.

It keeps the familiar v5 API (`BrowserRouter`, `Route`, `Switch`, `Link`, `useParams`, ...) and adds type-safe routing
helpers (`createRoute`) and query params validation backed by [zod](https://zod.dev).

## Install

```bash
pnpm add @scaleway/scouter
```

## Usage

### Routing

Wrap your app in a `BrowserRouter` and declare your routes with `Switch` and `Route`.

```tsx
import { BrowserRouter, Switch, Route, Link } from '@scaleway/scouter'

const App = () => (
  <BrowserRouter>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/users/42">User</Link>
    </nav>

    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/users/:id">
        <User />
      </Route>
    </Switch>
  </BrowserRouter>
)
```

### createRoute

`createRoute` returns a typed route object whose `link` method builds URLs from typed params,
so you can't misuse a route path or its parameters.

```tsx
import { createRoute } from '@scaleway/scouter'

const userRoute = createRoute('/users/:id')

userRoute.link({ id: '42' }) // -> '/users/42'
userRoute.link({ id: '42' }, { tab: 'settings' }) // -> '/users/42?tab=settings'
userRoute.link({ id: '42' }, null, 'profile') // -> '/users/42#profile'
```

### useSafeQueryParams

A hook to read and update query params while guaranteeing they match a zod schema.

```tsx
import { useSafeQueryParams } from '@scaleway/scouter'
import { z } from 'zod'

const Schema = z.object({
  model: z.string(),
})

const Component = () => {
  const { queryParams, setQueryParams } = useSafeQueryParams({ schema: Schema })

  return (
    <button
      onClick={() => setQueryParams({ model: 'test' })} // typed: passing `123` is a TS error
    >
      {JSON.stringify(queryParams)}
    </button>
  )
}
```

### useNavigate

A polyfill of [useNavigate](https://reactrouter.com/6.30.3/hooks/use-navigate) with the same interface.

```tsx
import { useNavigate } from '@scaleway/scouter'

const Component = () => {
  const navigate = useNavigate()

  navigate('/root')
  navigate('/root', { replace: true })
  navigate({ pathname: '/root', search: 'hello=world' })
}
```
