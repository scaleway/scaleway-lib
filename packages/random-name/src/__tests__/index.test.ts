import { describe, expect, it } from 'vitest'
import { randomName } from '..'

describe('randomName', () => {
  it('should return a random name separated by a dash', () => {
    expect(randomName().split('-').length).toBe(2)
  })

  it('should be able to customize prefix', () => {
    const name = randomName('prefix')
    expect(name.split('-')[0]).toBe('prefix')
    expect(name.split('-').length).toBe(3)
  })

  it('should be able to customize separator', () => {
    expect(randomName('', '/').split('/').length).toBe(2)
  })

  it('should be able to customize prefix and separator', () => {
    const name = randomName('prefix', '!')
    expect(name.split('!')[0]).toBe('prefix')
    expect(name.split('!').length).toBe(3)
  })

  it('should never have boring-wozniak', () => {
    const names = Array.from(new Array(1000000), () => randomName())
    expect(names).not.toEqual(
      expect.arrayContaining([expect.stringMatching('boring-wozniak')]),
    )
  })
})
