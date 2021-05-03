# `@scaleway/use-dataloader`

## Tiny hooks to help you manage asynchronous tasks

- Lightweight
- Easy to use
- Easy to integrate with Axios, fetch, or any Promise-based tool

## Install

```bash
$ yarn add @scaleway/use-dataloader
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

### useDataLoader

```js
import { useDataLoader } from '@scaleway-lib/use-dataloader'

const fakePromise = () =>
  new Promise(resolve => setTimeout(resolve('test'), 1000))

function MyComponent() {
  // Use a key if you want to persist data in the DataLoaderProvider cache
  const { data, isLoading, isSuccess, isError, error } = useDataLoader(
    'cache-key',
    fakePromise,
  )

  // Will be true during the promise
  if (isLoading) {
    return <div>Loading...</div>
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
  const { data, isLoading, isSuccess, isError, error } = useDataLoader(
    key,
    fakePromise,
  )

  // Will be true during the promise
  if (isLoading) {
    return <div>Loading...</div>
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
    enabled = true, // Launch request automatically
    keepPreviousData = true, // Do we need to keep the previous data after reload
  } = {},
)
```

|   Property   |                                                      Description                                                      |
| :----------: | :-------------------------------------------------------------------------------------------------------------------: |
|    isIdle    |                                         `true` if the request is not launched                                         |
|  isLoading   |                                           `true` if the request is launched                                           |
|  isSuccess   |                                      `true`if the request finished successfully                                       |
|   isError    |                                         `true` if the request throw an error                                          |
|  isPolling   | `true` if the request if `enabled` is true, `pollingInterval` is defined and the status is `isLoading` or `isSuccess` |
| previousData |                             if `keepPreviousData` is true it return the last data fetched                             |
|     data     |     return the `initialData` if no data is fetched or not present in the cache otherwise return the data fetched      |
|    error     |                                      return the error occured during the request                                      |
|    reload    |                            allow you to reload the data (it doesn't clear the actual data)                            |
