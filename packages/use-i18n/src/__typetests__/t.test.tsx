import { expect, test } from 'tstyche'
import { useI18n } from '../usei18n'

type I18NLocale = {
  hello: 'world'
  'doe.john': 'John Doe'
  'doe.jane': 'Jane Doe'
  'doe.child': 'Child is {name}'
  'describe.john': '{name} is {age} years old'
}

test('i18n - t', () => {
  const { t } = useI18n<I18NLocale>()
  expect(t('hello')).type.toBe<string>()
  // Single key
  expect(t).type.not.toBeCallableWith('keydoesnotexists')

  // Multiple keys
  expect(t('doe.john')).type.toBe<string>()
  expect(t).type.not.toBeCallableWith('doe.doesnotexists')

  // With a param
  expect(
    t('doe.child', {
      name: 'Name',
    }),
  ).type.toBe<string>()
  expect(t).type.not.toBeCallableWith('doe.doesnotexists', {
    name: 'Name',
  })

  expect(t).type.not.toBeCallableWith('doe.child', {})

  expect(t).type.not.toBeCallableWith('doe.child')

  // With multiple params
  expect(
    t('describe.john', {
      age: '30',
      name: 'John',
    }),
  ).type.toBe<string>()

  expect(t).type.not.toBeCallableWith('describe.john', {})
  expect(t).type.not.toBeCallableWith('describe.john')

  // With react components as param value
  expect(
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
  expect(t2).type.not.toBeCallableWith('test')
})
