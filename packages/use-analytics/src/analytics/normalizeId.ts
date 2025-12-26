type ID = string | number | undefined | null

export const normalizeId = (id: ID): string | undefined => {
  if (id === null || id === undefined) {
    return undefined
  }

  // Already a string but possibly JSON-encoded
  if (typeof id === 'string') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsed = JSON.parse(id)
      // Only use parsed if it’s a string too

      if (typeof parsed === 'string') {
        return parsed
      }
    } catch {
      // not JSON, keep original
    }

    return id
  }

  return String(id)
}
