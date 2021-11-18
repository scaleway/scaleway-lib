import randomName from '@scaleway/random-name'
import { useCallback } from 'react'

const useRandomName = (prefix = '', separator = '-'): string =>
  useCallback(() => randomName(prefix, separator), [prefix, separator])()

export default useRandomName
export { randomName }
