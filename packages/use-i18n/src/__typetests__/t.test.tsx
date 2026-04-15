import { expect as typeExpect, test as typeTest } from 'tstyche'
import { useI18n } from '../usei18n'

type I18NLocale = {
  hello: 'world'
  'doe.john': 'John Doe'
  'doe.jane': 'Jane Doe'
  'doe.child': 'Child is {name}'
  'describe.john': '{name} is {age} years old'
}

typeTest('i18n - t', () => {
  const { t } = useI18n<I18NLocale>()
  typeExpect(t('hello')).type.toBe<string>()
  // Single key
  typeExpect(t).type.not.toBeCallableWith('keydoesnotexists')

  // Multiple keys
  typeExpect(t('doe.john')).type.toBe<string>()
  typeExpect(t).type.not.toBeCallableWith('doe.doesnotexists')

  // With a param
  typeExpect(
    t('doe.child', {
      name: 'Name',
    }),
  ).type.toBe<string>()
  typeExpect(t).type.not.toBeCallableWith('doe.doesnotexists', {
    name: 'Name',
  })

  typeExpect(t).type.not.toBeCallableWith('doe.child', {})

  typeExpect(t).type.not.toBeCallableWith('doe.child')

  // With multiple params
  typeExpect(
    t('describe.john', {
      age: '30',
      name: 'John',
    }),
  ).type.toBe<string>()

  typeExpect(t).type.not.toBeCallableWith('describe.john', {})
  typeExpect(t).type.not.toBeCallableWith('describe.john')

  // With react components as param value
  typeExpect(
    t('doe.child', {
      name: (
        <p>
          My name is<b>John</b>
        </p>
      ),
    }),
  ).type.toBe<string>()

  // Required generic
  const { t: t2 } = useI18n<Record<'', string>>()
  typeExpect(t2).type.not.toBeCallableWith('test')
})
