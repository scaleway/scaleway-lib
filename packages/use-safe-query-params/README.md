# @scaleway/use-safe-query-params

A hook and an helper to safely interact with queryParams making sure that data match a zod schema

## Install

```bash
$ pnpm add @scaleway/use-safe-query-params
```

## Usage

```tsx
import { useSafeQueryParams } from '@scaleway/use-safe-query-params'
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
