import { useGrowthBook } from '@growthbook/growthbook-react'
import { useCallback, useMemo } from 'react'
import type { Attributes } from './types'

export const useAbTestAttributes = (): [
  Attributes,
  (attributes: Attributes) => void,
] => {
  const growthBook = useGrowthBook()

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
