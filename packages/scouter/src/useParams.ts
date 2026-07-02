import type { MatchParams } from './matchPath'
import { useRouteContext } from './useRouteContext'

export function useParams<P = MatchParams>(): P {
  const ctx = useRouteContext()

  if (ctx?.match) {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return ctx.match.params as P
  }
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return {} as P
}
