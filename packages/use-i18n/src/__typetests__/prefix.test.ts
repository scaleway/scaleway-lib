import { expectError, expectType } from 'tsd-lite'
import { useI18n } from '../usei18n'

// eslint-disable-next-line react-hooks/rules-of-hooks
const { t, namespaceTranslation } = useI18n<{
  prefix: 'myprefix'
  hello: 'world'
  'doe.john': 'John Doe'
  'doe.jane': 'Jane Doe'
  'doe.child': 'Child is {name}'
  'describe.john': '{name} is {age} years old'
}>()

expectType<string>(t('myprefix.hello'))
const scopedT = namespaceTranslation('myprefix')
expectType<string>(scopedT('doe.jane'))
expectError(scopedT('doe.child'))
expectError(scopedT('doe.child', {}))
expectType<string>(
  scopedT('doe.child', {
    name: 'Jacques',
  }),
)

const scopedT2 = namespaceTranslation('myprefix.doe')
expectType<string>(scopedT2('jane'))
expectError(scopedT2('child'))
expectError(scopedT2('child', {}))
expectType<string>(
  scopedT2('child', {
    name: 'Jacques',
  }),
)
