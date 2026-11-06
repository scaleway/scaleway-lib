// Shared components for the React Suspense tests.
// A component suspends by throwing a manually-controlled promise, so the tests
// can drive resolve/reject timing, navigation, and retries.

// oxlint-disable typescript/only-throw-error -- throwing a promise is the Suspense mechanism

import { useEffect, useState } from 'react'
import type { z } from 'zod'
import { useLocation, useParams, useSafeQueryParams } from '../../index'
import type { Deferred } from './suspense'
import { isResolved } from './suspense'

// Throws `deferred.promise` while it is pending, so the component suspends.
// Once resolved/rejected it renders its value (or throws the error again so an
// error boundary can catch it).
export const Suspender = ({ deferred, name }: { deferred: Deferred; name: string }) => {
  const status = isResolved(deferred)

  if (status === 'pending') {
    throw deferred.promise
  }

  if (status === 'rejected') {
    throw deferred.error
  }

  return (
    <div>
      {name} loaded: {deferred.value}
    </div>
  )
}

// Suspends and, once retried, reports the router context (params + location) so
// tests can check the context is correct across a Suspense retry.
export const ParamsSuspender = ({ deferred }: { deferred: Deferred }) => {
  const params = useParams()
  const location = useLocation()
  const status = isResolved(deferred)

  if (status === 'pending') {
    throw deferred.promise
  }

  return (
    <div>
      params:{JSON.stringify(params)} location:{location.pathname} value:{deferred.value}
    </div>
  )
}

// Suspends and reports the current search string when retried.
export const LocationSuspender = ({ deferred }: { deferred: Deferred }) => {
  const location = useLocation()
  const status = isResolved(deferred)

  if (status === 'pending') {
    throw deferred.promise
  }

  return <div>target:{location.search}</div>
}

// Suspends and reports the safe query params when retried.
export const QueryParamsSuspender = ({
  deferred,
  schema,
}: {
  deferred: Deferred
  schema: z.ZodObject<z.ZodRawShape>
}) => {
  const { queryParams } = useSafeQueryParams({ schema })
  const status = isResolved(deferred)

  if (status === 'pending') {
    throw deferred.promise
  }

  return <div>query:{JSON.stringify(queryParams)}</div>
}

// Suspends, then renders local state + a button, to check that component state
// is preserved across a Suspense retry (no remount).
export const StatefulSuspender = ({ deferred, onMount }: { deferred: Deferred; onMount: () => void }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    onMount()
  }, [onMount])

  const status = isResolved(deferred)

  if (status === 'pending') {
    throw deferred.promise
  }

  return (
    <div>
      <div>{`state:${count}`}</div>
      <button
        type="button"
        onClick={() => {
          setCount(count + 1)
        }}
      >
        increment
      </button>
    </div>
  )
}

// Renders one of the given pages once loaded; used to check two routes sharing
// a component type re-suspend instead of showing stale content.
export const SharedList = ({ deferred, name }: { deferred: Deferred; name: string }) => {
  if (isResolved(deferred) === 'pending') {
    throw deferred.promise
  }
  return <div>{name} content</div>
}
