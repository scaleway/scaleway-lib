import type { To } from 'history'
import { createPath } from 'history'
import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { useCallback } from 'react'
import { isModifiedEvent } from './isModifiedEvent'
import { useHistory } from './useHistory'

export type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>

export type LinkOptions = {
  replace?: boolean
}

export function useLinkProps(
  to: To,
  props: Omit<AnchorProps, 'href'> = {},
  options: LinkOptions = {},
): [props: AnchorProps, navigate: () => void] {
  const { replace = false } = options

  const history = useHistory()

  const { onClick: onClickProp, target, ...rest } = props

  const href = history.createHref(to)

  const navigate = useCallback(() => {
    // const location = resolveToLocation(to, context.location);
    const isDuplicateNavigation =
      createPath(history.location) === createPath(typeof to === 'string' ? { pathname: to } : to)
    if (replace || isDuplicateNavigation) {
      history.replace(to)
    } else {
      history.push(to)
    }
  }, [history, to, replace])

  const onClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      try {
        if (onClickProp) {
          onClickProp(event)
        }
      } catch (error) {
        event.preventDefault()
        throw error
      }

      if (
        !event.defaultPrevented && // onClickProp prevented default
        event.button === 0 && // ignore everything but left clicks
        (!target || target === '_self') && // let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // ignore clicks with modifier keys
      ) {
        event.preventDefault()
        navigate()
      }
    },
    [target, onClickProp, navigate],
  )

  return [
    {
      ...rest,
      href,
      target,
      onClick,
    },
    navigate,
  ]
}
