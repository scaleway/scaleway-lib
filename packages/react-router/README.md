# @scaleway/react-router

A collection of hooks and helpers to work with react-router

This package targets react-router v5 for now. An update to support react-router v7 is planned

## Install

```bash
$ pnpm add @scaleway/react-router
```

## Usage

### useSafeQueryParams

A hook to safely interact with queryParams making sure that data match a zod schema

```tsx
import { useSafeQueryParams } from '@scaleway/react-router'
import { z } from 'zod'

export const Schema = z.object({
  model: z.string(),
})

const Component = () => {
  const { queryParams, setQueryParams } = useSafeQueryParams({
    schema: DeploymentCreateQueryParamsSchema,
  })

  return (
    <div>
      <div>{JSON.stringify(queryParams)}</div>
      <button
        onClick={() => {
          setQueryParams({
            model: 'test', // if model: ['foo'] => ts error
          })
        }}
      >
        Set Query Params
      </button>
    </div>
  )
}
```
