import { randomName } from '@scaleway/random-name'
import { useMemo } from 'react'

const useRandomName = (prefix = '', separator = '-'): string =>
  useMemo(() => randomName(prefix, separator), [prefix, separator])

export default useRandomName
export { randomName, useRandomName }
