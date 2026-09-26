# `@scaleway/use-dataloader`

## Tiny hooks to help you manage asynchronous tasks

- Lightweight
- Easy to use
- Easy to integrate with Axios, fetch, or any Promise-based tool

## Install

```bash
pnpm add @scaleway/use-dataloader
```

## How to use

### Add DataLoaderProvider to your app

Firstly you need to put the context at the top of your App.

```js
import { DataLoaderProvider } from '@scaleway-lib/use-dataloader'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <DataLoaderProvider>
      <App />
    </DataLoaderProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
```

Now you can use `useDataLoader` and `useDataLoaderContext` in your App

#### `cacheKeyPrefix`

You can specify a global `cacheKeyPrefix` which will be inserted before each cache key

This can be useful if you have a global context (eg: if you can switch account in your app, ...)

```js
import { DataLoaderProvider, useDataLoader } from '@scaleway-lib/use-dataloader'
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  useDataLoader('cache-key', () => 'response') // Real key will be prefixed-cache-key

  return null
}

ReactDOM.render(
  <React.StrictMode>
    <DataLoaderProvider onError={globalOnError} cacheKeyPrefix="prefixed">
      <App />
    </DataLoaderProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
```

#### `maxConcurrentRequests`

You can specify a `maxConcurrentRequests` which will prevent DataLoader to launch request simultaneously and wait some to finish before start next ones.

This can be useful if you want to limit the number of concurrent requests.

#### `onError(err: Error): void | Promise<void>`

This is a global `onError` handler. It will be overriden if you specify one in `useDataLoader`

```js
import { DataLoaderProvider, useDataLoader } from '@scaleway-lib/use-dataloader'
import React from 'react'
import ReactDOM from 'react-dom'

const failingPromise = async () => {
  throw new Error('error')
}

const App = () => {
  useDataLoader('local-error', failingPromise, {
    onError: error => {
      console.log(`local onError: ${error}`)
    },
  })

  useDataLoader('error', failingPromise)

  return null
}

const globalOnError = error => {
  console.log(`global onError: ${error}`)
}

ReactDOM.render(
  <React.StrictMode>
    <DataLoaderProvider onError={globalOnError}>
      <App />
    </DataLoaderProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
```

### useDataLoader

```js
import { useDataLoader } from '@scaleway-lib/use-dataloader'

const fakePromise = () => new Promise(resolve => setTimeout(resolve('test'), 1000))

function MyComponent() {
  // Use a key if you want to persist data in the DataLoaderProvider cache
  const { data, isLoading, isFetching, isSuccess, isError, error } = useDataLoader('cache-key', fakePromise)

  // This is the first time we load the data
  if (isLoading && !data) {
    return <div>Loading initial data...</div>
  }

  // This happen when you already loaded the data but want to reload it
  if (isFetching && data) {
    return <div>Refreshing...</div>
  }

  // Will be true when the promise is resolved
  if (isSuccess) {
    // Will display "test" in the the div
    return <div>{data}</div>
  }

  // Will be false when the promise is rejected
  if (isError) {
    // Will display the error in the the div
    return <div>{error}</div>
  }
}

export default MyComponent
```

### useDataLoaderContext

```js
import { useDataLoaderContext } from '@scaleway-lib/use-dataloader'

const fakePromise = () =>
  new Promise(resolve => {
    setTimeout(resolve('test'), 1000):
  })


function MyComponentThatUseDataLoader({key}) {
  // Use a key if you want to persist data in the DataLoaderProvider cache
  const { data, isLoading, isFetching, isSuccess, isError, error } = useDataLoader(
    key,
    fakePromise,
  )

  // Will be true during the initial load
  if (isLoading) {
    return <div>Loading initial data...</div>
  }

  // Will be true during any active request (initial or subsequent)
  if (isFetching) {
    return <div>Refreshing...</div>
  }

  // Will be true when the promise is resolved
  if (isSuccess) {
    // Will display "test" in the the div
    return <div>{data}</div>
  }

  // Will be false when the promise is rejected
  if (isError) {
    // Will display the error in the the div
    return <div>{error}</div>
  }
}


function MyComponent() {
  const { reloadAll, reload } = useDataLoaderContext();

  const handleReload = (keyToReload) => () => {
      await reload(keyToReload) // Execute the method
    }
  }

  const handleReloadAll = () => {
      await reloadAll()
    }
  }

  return (
    <div>
      <MyComponentThatUseDataLoader key="test" />
      <MyComponentThatUseDataLoader key="test-2" />
      <button onClick={handleReload("test")}>Reload first</button>
      <button onClick={handleReload("test-2")}>Reload second</button>
      <button onClick={handleReloadAll}>Reload all</button>
    </div>
  )
}

export default MyComponent
```

---

## API

### useDataLoader

```js
const useDataLoader = (
  key, // A key to save the data fetched in a local cache
  method, // A method that return a promise (ex: () => new Promise((resolve) => setTimeout(resolve, 2000))
  {
    onSuccess, // Callback when a request success
    onError, // Callback when a error is occured
    initialData, // Initial data if no one is present in the cache before the request
    pollingInterval, // Relaunch the request after the last success
    needPolling = true, // If true or function return true it will execute the polling
    enabled = true, // Launch request automatically
    keepPreviousData = true, // Do we need to keep the previous data after reload
    dataLifetime, // Max time before previous success data is outdated (in millisecond). By default refetch on every mount
  } = {},
)
```

The hook returns an object with the following properties:

|   Property   |                                                                 Description                                                                  |
| :----------: | :------------------------------------------------------------------------------------------------------------------------------------------: |
|    isIdle    |                                                    `true` if the request is not launched                                                     |
|  isLoading   |                                       `true` only during the initial fetch when there's no cached data                                       |
|  isFetching  |                                  `true` when there is an active request in progress (initial or subsequent)                                  |
|  isSuccess   |                                                  `true`if the request finished successfully                                                  |
|   isError    |                                                     `true` if the request throw an error                                                     |
|  isPolling   | `true` if the request if `enabled` is true, `pollingInterval` is defined and the status is `isLoading`,`isSuccess` or during the first fetch |
| previousData |                                        if `keepPreviousData` is true it return the last data fetched                                         |
|     data     |                 return the `initialData` if no data is fetched or not present in the cache otherwise return the data fetched                 |
|    error     |                                                 return the error occured during the request                                                  |
|    reload    |                                       allow you to reload the data (it doesn't clear the actual data)                                        |

### Abort signal

Every `method` function receives an optional `AbortSignal` as its last argument. This signal is managed automatically by the `DataLoader` — you don't need to create it yourself.

#### How it works

- When a request starts, `DataLoader` creates a new `AbortController` and passes its `signal` to your `method`.
- When the request is cancelled (e.g. component unmount, cache invalidation, or a new request supersedes an in-flight one), `DataLoader` calls `abortController.abort()`.
- Aborted requests are **silently ignored** — the error is not propagated to `onError` and the status is not set to `isError`.

#### Using the signal with `fetch`

```js
useDataLoader('user-profile', async signal => {
  const response = await fetch('/api/user', { signal })
  if (!response.ok) throw new Error('Failed to fetch user')
  return response.json()
})
```

When the request is cancelled, `fetch` will reject with an `AbortError`. The `DataLoader` catches this error and silently discards it — your `onError` handler will not be called.

#### Using the signal with Axios

Axios supports `AbortSignal` via the `signal` config option:

```js
useDataLoader('projects', async signal => {
  const { data } = await axios.get('/api/projects', { signal })
  return data
})
```

#### Using the signal with `useInfiniteDataLoader`

The `useInfiniteDataLoader` hook also passes the `AbortSignal` as the second argument to your `method`:

```js
useInfiniteDataLoader(
  'paginated-projects',
  async (params, signal) => {
    const response = await fetch(`/api/projects?page=${params.page}`, { signal })
    return response.json()
  },
  { pageParamKey: 'page' },
)
```

#### When is the signal aborted?

| Scenario | Signal aborted? |
|----------|:--------------:|
| Component unmounts | Yes |
| `reload()` is called while a request is in-flight | Yes |
| Cache is cleared via `clearData()` | Yes |
| A new request supersedes an in-flight one (same key) | Yes |
| Request completes normally | No (signal is stale) |
| Request fails with a non-abort error | No (signal is stale) |

> **Note:** The signal is created per-request. If your `method` ignores the signal, cancellation will still prevent the result from being cached or triggering state updates, but the underlying HTTP request will continue to completion.
