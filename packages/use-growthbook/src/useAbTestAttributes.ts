// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error TODO: remove once Growthbook is correctly typed and export
import { useGrowthBook } from '@growthbook/growthbook-react'
import { useCallback, useMemo } from 'react'
import type { Attributes, GrowthBookType } from './types'

export const useAbTestAttributes = (): [
  Attributes,
  (attributes: Attributes) => null | undefined,
] => {
  const growthBook = useGrowthBook() as GrowthBookType | null

  const attributes: Attributes = useMemo(
    () => growthBook?.getAttributes() ?? {},
    [growthBook],
  )

  const setAttributes = useCallback(
    (newAttributes: Attributes) =>
      growthBook?.setAttributes({
        ...attributes,
        ...newAttributes,
      }),
    [growthBook, attributes],
  )

  return [attributes, setAttributes]
}
