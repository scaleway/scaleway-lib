/**/
import { describe, expectTypeOf, it } from 'vitest'
import { useI18n } from '../usei18n'

const ListLocales = ['es', 'en', 'fr', 'fr-FR', 'en-GB'] as const
type Locales = (typeof ListLocales)[number]
type Locale = {
  hello: 'world'
  'doe.john': 'John Doe'
  'doe.jane': 'Jane Doe'
  'doe.child': 'Child is {name}'
  'describe.john': '{name} is {age} years old'
}

describe('i18n - namespaceTranslation', () => {
  it('should work with namespaceTranslation function', () => {
    const { namespaceTranslation } = useI18n<Locale, Locales>()

    expectTypeOf(namespaceTranslation).parameters.not.toEqualTypeOf<['hello']>()

    expectTypeOf(namespaceTranslation).parameters.not.toEqualTypeOf<
      ['doe.john']
    >()

    expectTypeOf(namespaceTranslation('doe')('john')).toEqualTypeOf<string>()

    expectTypeOf(namespaceTranslation('doe'))
      .parameter(0)
      .not.toEqualTypeOf<'doesnotexists'>()

    expectTypeOf(namespaceTranslation('doe')).parameters.not.toEqualTypeOf<
      ['child']
    >()
    expectTypeOf(
      namespaceTranslation('doe')('child', {
        name: 'Name',
      }),
    ).toEqualTypeOf<string>()
    expectTypeOf(namespaceTranslation('doe')).parameters.not.toEqualTypeOf<
      ['doesnotexists', { name: string }]
    >()
    expectTypeOf(namespaceTranslation('doe')).parameters.not.toEqualTypeOf<
      ['child', { doesnotexists: string }]
    >()

    expectTypeOf(namespaceTranslation('doe')).parameters.not.toEqualTypeOf<
      ['child', Record<string, never>]
    >()
    expectTypeOf(namespaceTranslation('doe')).parameters.not.toEqualTypeOf<
      ['child']
    >()

    expectTypeOf(
      namespaceTranslation('describe')('john', {
        age: '30',
        name: 'John',
      }),
    ).toEqualTypeOf<string>()

    expectTypeOf(namespaceTranslation('describe')).parameters.not.toEqualTypeOf<
      ['john', Record<string, never>]
    >()
    expectTypeOf(namespaceTranslation('describe')).parameters.not.toEqualTypeOf<
      ['john']
    >()

    const { namespaceTranslation: namespaceTranslation2 } = useI18n<Locale>()
    expectTypeOf(namespaceTranslation2).parameter(0).not.toEqualTypeOf<'test'>()
  })
})
