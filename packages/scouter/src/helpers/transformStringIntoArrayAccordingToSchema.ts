// oxlint-disable typescript/no-unsafe-assignment typescript/no-unsafe-member-access typescript/no-explicit-any
import { z } from 'zod'

type QueryParamsType = Record<string, string | string[] | undefined>

export const transformStringIntoArrayAccordingToSchema = ({
  schema,
  values,
}: {
  schema: z.ZodObject<any>
  values: QueryParamsType
}) => {
  const newValues: QueryParamsType = {}
  for (const [key, value] of Object.entries(values)) {
    const field = schema.shape[key]
    if (field !== undefined) {
      const isOptional = field instanceof z.ZodOptional
      const innerField = isOptional ? field.unwrap() : field
      newValues[key] = innerField instanceof z.ZodArray && typeof value === 'string' ? [value] : value
    }
  }
  return newValues
}
