import { describe, expectTypeOf, it } from 'vitest'
import { useI18n } from '../usei18n'

type I18NLocale = {
  hello: 'world'
  'doe.john': 'John Doe'
  'doe.jane': 'Jane Doe'
  'doe.child': 'Child is {name}'
  'describe.john': '{name} is {age} years old'
}

describe('i18n - t', () => {
  it('should work with t function', () => {
    const { t } = useI18n<I18NLocale>()
    expectTypeOf(t('hello')).toEqualTypeOf<string>()
    expectTypeOf(t).parameter(0).not.toEqualTypeOf<'keydoesnotexists'>()

    expectTypeOf(t('doe.john')).toEqualTypeOf<string>()
    expectTypeOf(t).parameter(0).not.toEqualTypeOf<'doe.doesnotexists'>()

    expectTypeOf(
      t('doe.child', {
        name: 'Name',
      }),
    ).toEqualTypeOf<string>()
    expectTypeOf(t).parameters.not.toEqualTypeOf<
      ['doe.doesnotexists', { name: string }]
    >()

    expectTypeOf(t).parameters.not.toEqualTypeOf<
      ['doe.child', Record<string, never>]
    >()

    expectTypeOf(t).parameters.not.toEqualTypeOf<['doe.child']>()

    expectTypeOf(
      t('describe.john', {
        age: '30',
        name: 'John',
      }),
    ).toEqualTypeOf<string>()

    expectTypeOf(t).parameters.not.toEqualTypeOf<
      ['describe.john', Record<string, never>]
    >()
    expectTypeOf(t).parameters.not.toEqualTypeOf<['describe.john']>()

    expectTypeOf(
      t('doe.child', {
        name: (
          <p>
            My name is<b>John</b>
          </p>
        ),
      }),
    ).toEqualTypeOf<string>()

    const { t: t2 } = useI18n<Record<'', string>>()
    expectTypeOf(t2).parameter(0).not.toEqualTypeOf<'test'>()
  })
})
