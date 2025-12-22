import type { RudderAnalytics } from '@rudderstack/analytics-js'
import type {
  EventProperties,
  Analytics as SegmentAnalytics,
} from '@segment/analytics-next'

// Check if a user is opening the link in a new tab
function userNewTab(event: Event): boolean {
  const typedEvent = event as Event & {
    ctrlKey: boolean
    shiftKey: boolean
    metaKey: boolean
    button: number
  }
  if (
    typedEvent.ctrlKey ||
    typedEvent.shiftKey ||
    typedEvent.metaKey ||
    (typedEvent.button && typedEvent.button === 1)
  ) {
    return true
  }

  return false
}

// Check if the link opens in new tab
function linkNewTab(
  element: HTMLAnchorElement,
  href: string | null | undefined,
): boolean {
  if (element.target === '_blank' && href) {
    return true
  }

  return false
}

export type JQueryShim<TElement = HTMLElement> = {
  toArray(): TElement[]
}

export type TrackLink = SegmentAnalytics['trackLink']

/**
 * @deprecated
 * this function is a wrapper of a Track to facilitate the migration from segment to rudderstack
 */
export const trackLink =
  (analytics: RudderAnalytics) =>
  (...args: Parameters<SegmentAnalytics['trackLink']>) => {
    const [links, event, properties] = args
    let elements: Element[] = []
    // always arrays, handles jquery
    if (!links) {
      return this
    }
    if (links instanceof Element) {
      elements = [links]
    } else if ('toArray' in links) {
      elements = links.toArray()
    } else {
      elements = links
    }

    elements.forEach((el: Element) => {
      el.addEventListener(
        'click',
        (elementEvent: Event) => {
          const href =
            el.getAttribute('href') ||
            el.getAttributeNS('http://www.w3.org/1999/xlink', 'href') ||
            el.getAttribute('xlink:href') ||
            el.getElementsByTagName('a')[0]?.getAttribute('href')

          if (
            !linkNewTab(el as HTMLAnchorElement, href) &&
            !userNewTab(elementEvent)
          ) {
            if (href) {
              elementEvent.preventDefault()

              analytics.track(event as string, properties as EventProperties)

              window.location.href = href
            }
          }
        },
        false,
      )
    })

    return this
  }
