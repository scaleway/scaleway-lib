/* eslint-disable react-hooks/rules-of-hooks */
import { expectError, expectType } from 'tsd-lite'
import { useI18n } from '../usei18n'

const { namespaceTranslation } = useI18n<{
  hello: 'world'
  'doe.john': 'John Doe'
  'doe.jane': 'Jane Doe'
  'doe.child': 'Child is {name}'
  'describe.john': '{name} is {age} years old'
}>()

// Single key
expectError(namespaceTranslation('hello'))

// Multiple keys
expectError(namespaceTranslation('doe.john'))
const scopedT1 = namespaceTranslation('doe')
expectType<string>(scopedT1('john'))
expectError(scopedT1('doesnotexists'))

// With a param
const scopedT2 = namespaceTranslation('doe')
expectError(scopedT2('child'))
expectType<string>(
  scopedT2('child', {
    name: 'Name',
  }),
)
expectError(
  scopedT2('doesnotexists', {
    name: 'Name',
  }),
)
expectError(
  scopedT2('child', {
    doesnotexists: 'Name',
  }),
)
expectError(scopedT2('child', {}))
expectError(scopedT2('child'))

// With multiple params
const scopedT3 = namespaceTranslation('describe')
expectType<string>(
  scopedT3('john', {
    age: '30',
    name: 'John',
  }),
)
expectError(scopedT3('john', {}))
expectError(scopedT3('john'))

// Required generic
const { namespaceTranslation: namespaceTranslation2 } = useI18n()
expectError(namespaceTranslation2('test'))
