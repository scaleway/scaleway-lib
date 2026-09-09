import { useGrowthBook } from '@growthbook/growthbook-react'
import type { Attributes } from './types'

export const useAbTestAttributes = (): [Attributes, (attributes: Attributes) => Promise<void>] => {
  const growthBook = useGrowthBook()

  const attributes = growthBook.getAttributes()

  const setAttributes = async (newAttributes: Attributes) => {
    await growthBook.setAttributes({
      ...attributes,
      ...newAttributes,
    })
  }

  return [attributes, setAttributes]
}
