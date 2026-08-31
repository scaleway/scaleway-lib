import { ADJECTIVES, NAMES } from './constants'

const randomName = (prefix = '', separator = '-'): string => {
  const name = `${
    ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)] ?? ''
  }${separator}${NAMES[Math.floor(Math.random() * NAMES.length)] ?? ''}`

  /* Steve Wozniak is not boring. This is part of the docker names spec. */
  if (name === `boring${separator}wozniak`) {
    return randomName(prefix, separator)
  }

  return prefix.length > 0 ? `${prefix}${separator}${name}` : name
}

export { randomName }

export default randomName
