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

Now you can use `useDataLoader`, `useDataLoaderContext` and `usePaginatedDataLoader` in your App

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

### usePaginatedDataLoader

```js
import { usePaginatedDataLoader } from '@scaleway-lib/use-dataloader'

const fakePromise = () =>
  new Promise(resolve => setTimeout(resolve('test'), 1000))

function MyComponent() {
  // Use a key if you want to persist data in the DataLoaderProvider cache
  const {
    currentPage,
    data,
    isLoading,
    isLoadingMore,
    isSuccess,
    isError,
    error,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    paginatedData,
  } = usePaginatedDataLoader('cache-key', fakePromise, {
    page: 1, // This value are the default one
    pageSize: 25, // This value are the default one
  })

  // Will be true during the promise
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Will be true when the promise is resolved
  if (isSuccess) {
    // Will display "test" in the the div
    return (
      <div>
        <div>Page data: {data.join(',')}</div>
        <div>All data: {data.join(',')}</div>
        <div>
          <button onClick={goToPreviousPage}>Previous</button>
          <div>Page: {currentPage}</div>
          <button
            onClick={hasNextPage ? goToNextPage : undefined}
            disabled={!hasNextPage}
          >
            {hasNextPage ? 'Next' : 'No More page'}
          </button>
        </div>
        {isLoadingMore && <div>Loading more data...</div>}
      </div>
    )
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
import { usePaginatedDataLoader } from '@scaleway-lib/use-dataloader'

const fakePromise = () =>
  new Promise(resolve => {
    console.log('Run promise')
    setTimeout(resolve('test'), 1000):
  })

function MyComponent() {
  const { getReloads, addReloads, addCachedData, clearCachedData, clearReloads } = useDataLoaderContext();
  const [data, setData] = useState()

  const handleReload = () => {
    const reload = getReloads('test') // Get the method with the test key
    if (reload) {
      const result = await reload() // Execute the method
      addCachedData('test', result) // Add the result to the cache
      setData(result)
    }
  }

  const handleLoad = async () => {
    const cachedData = getCachedData('test') // Check if another component fetch a data with the test key
    if (cachedData) {
      setData(cachedData)
    } else {
      handleReload()
    }
  }

  const handleClearData = () => {
    clearCachedData('test') // Clear only the cached data of the test key
    clearCachedData() // Clear all cached data
  }

  useEffect(() => {
    addReloads('test', fakePromise); // Add a reload in the context

    return () => {
      clearReloads('test') // Clear only the reload with the test key
      clearReloads() // Clear all reloads
    }
  }, [])

  return (
    <div>
      <div>{data}</div>
      <button onClick={handleLoad}>Load data</button>
      <button onClick={handleReload}>Force reload data</button>
      <button onClick={handleClearData}>Clear reload data</button>
    </div>
  )
}

export default MyComponent
```
