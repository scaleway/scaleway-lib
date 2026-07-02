import type { ReactElement } from 'react'
import { Children, cloneElement, isValidElement } from 'react'
import type { MaybeMatch } from './matchPath'
import { matchPaths } from './matchPath'
import { useLocation } from './useLocation'
import { useRouteContext } from './useRouteContext'

export type SwitchProps = {
  children: React.ReactNode
}

function validatePathProps(maybePath: unknown): string[] | undefined {
  if (typeof maybePath === 'string') {
    return [maybePath]
  }
  if (Array.isArray(maybePath) && maybePath.every(p => typeof p === 'string')) {
    return maybePath
  }
  return undefined
}

function extractRouteProps(element: ReactElement): { path?: string[]; exact?: boolean } {
  if ('props' in element) {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    const props = element.props as Record<string, unknown>
    const maybePath = props['path'] ?? props['from']
    const maybeExact = props['exact']

    return {
      exact: typeof maybeExact === 'boolean' ? maybeExact : undefined,
      path: validatePathProps(maybePath),
    }
  }
  return {}
}

export const Switch = ({ children }: SwitchProps) => {
  const location = useLocation()
  const parentRoute = useRouteContext()

  let element: React.ReactElement | undefined = undefined
  let match: MaybeMatch = null

  // We use React.Children.forEach instead of React.Children.toArray().find()
  // here because toArray adds keys to all child elements and we do not want
  // to trigger an unmount/remount for two <Route>s that render the same
  // component at different URLs.
  Children.forEach(children, child => {
    if (!match && isValidElement(child)) {
      element = child
      const props = extractRouteProps(child)
      match = props.path
        ? matchPaths(location.pathname, props.path, {
            exact: props.exact === true ? true : undefined,
          })
        : parentRoute.match
    }
  })

  // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-type-assertion typescript/no-unsafe-argument
  return match ? cloneElement(element as any, { computedMatch: match }) : null
}
