// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error TODO: remove once Growthbook is correctly typed and export
import { useGrowthBook } from '@growthbook/growthbook-react'
import { useCallback, useMemo } from 'react'
import type { GrowthBookType } from './types'

export const useAbTestAttributes = () => {
  const growthBook = useGrowthBook() as GrowthBookType | null

  const attributes: Record<string, unknown> = useMemo(
    () => growthBook?.getAttributes() ?? {},
    [growthBook],
  )

  const setAttributes = useCallback(
    (newAttributes: Record<string, unknown>) =>
      growthBook?.setAttributes({
        ...attributes,
        ...newAttributes,
      }),
    [growthBook, attributes],
  )

  return [attributes, setAttributes]
}
