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
