/* eslint-disable react-hooks/rules-of-hooks */
import { expect, test } from 'tstyche'
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

test('i18n - namespaceTranslation', () => {
  const { namespaceTranslation } = useI18n<Locale, Locales>()

  // Single key
  expect(namespaceTranslation).type.not.toBeCallableWith('hello')
  // Multiple keys
  expect(namespaceTranslation).type.not.toBeCallableWith('doe.john')

  expect(namespaceTranslation('doe')('john')).type.toBe<string>()

  expect(namespaceTranslation('doe')).type.not.toBeCallableWith('doesnotexists')

  // With a param
  expect(namespaceTranslation('doe')).type.not.toBeCallableWith('child')
  expect(
    namespaceTranslation('doe')('child', {
      name: 'Name',
    }),
  ).type.toBe<string>()
  expect(namespaceTranslation('doe')).type.not.toBeCallableWith(
    'doesnotexists',
    {
      name: 'Name',
    },
  )
  expect(namespaceTranslation('doe')).type.not.toBeCallableWith('child', {
    doesnotexists: 'Name',
  })

  expect(namespaceTranslation('doe')).type.not.toBeCallableWith('child', {})
  expect(namespaceTranslation('doe')).type.not.toBeCallableWith('child')

  // With multiple params
  expect(
    namespaceTranslation('describe')('john', {
      age: '30',
      name: 'John',
    }),
  ).type.toBe<string>()

  expect(namespaceTranslation('describe')).type.not.toBeCallableWith('john', {})
  expect(namespaceTranslation('describe')).type.not.toBeCallableWith('john')

  // Required generic
  const { namespaceTranslation: namespaceTranslation2 } = useI18n<Locale>()
  expect(namespaceTranslation2).type.not.toBeCallableWith('test')
})
