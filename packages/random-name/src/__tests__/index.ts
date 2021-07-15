import randomName from '..'

describe('randomNames', () => {
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
})
