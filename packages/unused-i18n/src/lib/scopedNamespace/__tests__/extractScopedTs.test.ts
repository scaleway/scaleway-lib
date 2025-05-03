import { describe, expect, it } from 'vitest'
import { extractScopedTs } from '../extractScopedTs'

describe('extractScopedTs', () => {
  it('should extract scoped translations correctly', () => {
    const fileContent = `
        {keyLabel ?? scopedT('labelKey1')}
        {keyLabel ? scopedT('labelKey2') : scopedT('labelKey3')}
        {scopedT(keyLabel ? 'labelKey4' : 'labelKey5')}
        {scopedT(\`labelKey6.\${variable}\`)}
        {scopedT(variable0)}
        {scopedT(\`\${variable1}.\${variable2}\`)}
        {scopedT('labelKey13', {
            name: scopedT('labelKey14')
        })}
        {scopedT(statusInformation.message)}
        {scopedT(
          isMFAEnforced
            ? 'text.status.enforced'
            : 'text.status.not_enforced',
        )}
        scopedT(activated ? 'deactivate.success' : 'activate.success', {
          identifier: domain,
        })
        {scopedT(
          device.status === 'enabled'
            ? 'dropdown.disable'
            : 'dropdown.enable',
        )}
        {scopedT(locked ? 'unlock.description' : 'lock.description', {
          identifier: (
            <Text as="span" variant="bodyStrong" prominence="strong">
              {domain}
            </Text>
          ),
        })}
        {scopedT(
          activated ? 'deactivate.description' : 'activate.description',
          {
            identifier: (
              <Text as="span" variant="bodyStrong" prominence="strong">
                {domain}
              </Text>
            ),
          },
        )}
        {scopedT(
        \`addForm.name.\${
          organization?.type === 'professional' ? 'corporate' : 'individual'
        }\`,
        )}
        {scopedT(
          offer.product?.supportIncluded
            ? 'support'
            : 'support.notIncluded',
        )}
        {scopedT(
          offer.product?.databasesQuota === -1
            ? 'database'
            : 'database.limited',
        )}
        {scopedT(
          isSubscriptionConfirmed({
            subscriptionArn: subscription.SubscriptionArn,
          })
            ? 'confirmed'
            : 'notConfirmed',
        )}
      `

    const namespaceTranslation = 'namespace'
    const expected = [
      'namespace.confirmed',
      'namespace.notConfirmed',
      'namespace.labelKey4',
      'namespace.labelKey5',
      'namespace.text.status.enforced',
      'namespace.text.status.not_enforced',
      'namespace.database',
      'namespace.database.limited',
      'namespace.support',
      'namespace.support.notIncluded',
      'namespace.dropdown.disable',
      'namespace.dropdown.enable',
      'namespace.deactivate.success',
      'namespace.activate.success',
      'namespace.unlock.description',
      'namespace.lock.description',
      'namespace.deactivate.description',
      'namespace.activate.description',
      'namespace.labelKey1',
      'namespace.labelKey2',
      'namespace.labelKey3',
      'namespace.labelKey6.**',
      'namespace.**.**',
      'namespace.labelKey13',
      'namespace.labelKey14',
      'namespace.addForm.name.corporate',
      'namespace.addForm.name.individual',
      'namespace.**',
    ]
    const result = extractScopedTs({
      fileContent,
      namespaceTranslation,
      scopedName: 'scopedT',
    })

    expect(result).toEqual(expect.arrayContaining(expected))
    expect(expected).toEqual(expect.arrayContaining(result))
  })
})
