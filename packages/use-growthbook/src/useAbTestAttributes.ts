import { useGrowthBook } from '@growthbook/growthbook-react'
import type { Attributes } from './types'

export const useAbTestAttributes = (): [
  Attributes,
  (attributes: Attributes) => void,
] => {
  const growthBook = useGrowthBook()

  const attributes = growthBook.getAttributes()

  const setAttributes = (newAttributes: Attributes) =>
    growthBook.setAttributes({
      ...attributes,
      ...newAttributes,
    })

  return [attributes, setAttributes]
}
