/**/
import { expect as typeExpect, test as typeTest } from 'tstyche'
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

typeTest('i18n - namespaceTranslation', () => {
  const { namespaceTranslation } = useI18n<Locale, Locales>()

  // Single key
  typeExpect(namespaceTranslation).type.not.toBeCallableWith('hello')

  // Multiple keys
  typeExpect(namespaceTranslation).type.not.toBeCallableWith('doe.john')

  typeExpect(namespaceTranslation('doe')('john')).type.toBe<string>()

  typeExpect(namespaceTranslation('doe')).type.not.toBeCallableWith(
    'doesnotexists',
  )

  // With a param
  typeExpect(namespaceTranslation('doe')).type.not.toBeCallableWith('child')
  typeExpect(
    namespaceTranslation('doe')('child', {
      name: 'Name',
    }),
  ).type.toBe<string>()
  typeExpect(namespaceTranslation('doe')).type.not.toBeCallableWith(
    'doesnotexists',
    {
      name: 'Name',
    },
  )
  typeExpect(namespaceTranslation('doe')).type.not.toBeCallableWith('child', {
    doesnotexists: 'Name',
  })

  typeExpect(namespaceTranslation('doe')).type.not.toBeCallableWith('child', {})
  typeExpect(namespaceTranslation('doe')).type.not.toBeCallableWith('child')

  // With multiple params
  typeExpect(
    namespaceTranslation('describe')('john', {
      age: '30',
      name: 'John',
    }),
  ).type.toBe<string>()

  typeExpect(namespaceTranslation('describe')).type.not.toBeCallableWith(
    'john',
    {},
  )
  typeExpect(namespaceTranslation('describe')).type.not.toBeCallableWith('john')

  // Required generic
  const { namespaceTranslation: namespaceTranslation2 } = useI18n<Locale>()
  typeExpect(namespaceTranslation2).type.not.toBeCallableWith('test')
})
