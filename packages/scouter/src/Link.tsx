import type { To } from 'history'
import type { AnchorHTMLAttributes, ForwardedRef } from 'react'
import { createElement, forwardRef } from 'react'
import { useLinkProps } from './useLinkProps'

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'heref'> & {
  to: To
  replace?: boolean
  // oxlint-disable-next-line typescript/no-explicit-any
  component?: React.ComponentType<any>
}

export const Link = forwardRef(
  ({ to, replace, component, ...inProps }: LinkProps, ref: ForwardedRef<HTMLAnchorElement>) => {
    const [props] = useLinkProps(to, inProps, { replace })

    return createElement(component ?? 'a', { ...props, ref })
  },
)
