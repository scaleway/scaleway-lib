import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['react', 'react-perf', 'jsx-a11y'],
  rules: {
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/button-has-type
     * @todo No consensus as of yet
     */
    'react/button-has-type': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/checked-requires-onchange-or-readonly
     * @todo No consensus as of yet
     */
    'react/checked-requires-onchange-or-readonly': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/display-name
     * @todo No consensus as of yet
     */
    'react/display-name': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/exhaustive-deps
     */
    'react/exhaustive-deps': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/forbid-component-props
     * @todo No consensus as of yet
     */
    'react/forbid-component-props': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/forbid-dom-props
     * @todo No consensus as of yet
     */
    'react/forbid-dom-props': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/forbid-elements
     * @todo No consensus as of yet
     */
    'react/forbid-elements': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/forward-ref-uses-ref
     */
    'react/forward-ref-uses-ref': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/function-component-definition
     * @todo No consensus as of yet
     */
    'react/function-component-definition': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/hook-use-state
     * @todo No consensus as of yet
     */
    'react/hook-use-state': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/iframe-missing-sandbox
     * @todo No consensus as of yet
     */
    'react/iframe-missing-sandbox': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-boolean-value
     * @todo No consensus as of yet
     */
    'react/jsx-boolean-value': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-curly-brace-presence
     * @todo No consensus as of yet
     */
    'react/jsx-curly-brace-presence': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-filename-extension
     * @todo No consensus as of yet
     */
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-fragments
     * @todo No consensus as of yet
     */
    'react/jsx-fragments': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-handler-names
     * @todo No consensus as of yet
     */
    'react/jsx-handler-names': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-key
     */
    'react/jsx-key': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-max-depth
     * @todo No consensus as of yet
     */
    'react/jsx-max-depth': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-comment-textnodes
     * @todo No consensus as of yet
     */
    'react/jsx-no-comment-textnodes': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-constructed-context-values
     * @todo No consensus as of yet
     */
    'react/jsx-no-constructed-context-values': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-duplicate-props
     */
    'react/jsx-no-duplicate-props': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-literals
     * @todo No consensus as of yet
     */
    'react/jsx-no-literals': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-script-url
     * @todo No consensus as of yet
     */
    'react/jsx-no-script-url': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-target-blank
     * @todo No consensus as of yet
     */
    'react/jsx-no-target-blank': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-undef
     */
    'react/jsx-no-undef': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-no-useless-fragment
     * @todo No consensus as of yet
     */
    'react/jsx-no-useless-fragment': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-pascal-case
     * @todo No consensus as of yet
     */
    'react/jsx-pascal-case': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-props-no-spread-multi
     */
    'react/jsx-props-no-spread-multi': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/jsx-props-no-spreading
     * @todo No consensus as of yet
     */
    'react/jsx-props-no-spreading': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-array-index-key
     * @todo No consensus as of yet
     */
    'react/no-array-index-key': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-children-prop
     */
    'react/no-children-prop': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-clone-element
     * @todo No consensus as of yet
     */
    'react/no-clone-element': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-danger
     * @todo No consensus as of yet
     */
    'react/no-danger': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-danger-with-children
     */
    'react/no-danger-with-children': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-did-mount-set-state
     */
    'react/no-did-mount-set-state': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-did-update-set-state
     */
    'react/no-did-update-set-state': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-direct-mutation-state
     */
    'react/no-direct-mutation-state': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-find-dom-node
     */
    'react/no-find-dom-node': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-is-mounted
     */
    'react/no-is-mounted': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-multi-comp
     * @todo No consensus as of yet
     */
    'react/no-multi-comp': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-namespace
     * @todo No consensus as of yet
     */
    'react/no-namespace': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-object-type-as-default-prop
     * @todo No consensus as of yet
     */
    'react/no-object-type-as-default-prop': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-react-children
     * @todo No consensus as of yet
     */
    'react/no-react-children': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-redundant-should-component-update
     * @todo No consensus as of yet
     */
    'react/no-redundant-should-component-update': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-render-return-value
     */
    'react/no-render-return-value': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-set-state
     * @todo No consensus as of yet
     */
    'react/no-set-state': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-string-refs
     */
    'react/no-string-refs': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-this-in-sfc
     */
    'react/no-this-in-sfc': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-unescaped-entities
     * @todo No consensus as of yet
     */
    'react/no-unescaped-entities': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-unknown-property
     * @todo No consensus as of yet
     */
    'react/no-unknown-property': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-unsafe
     */
    'react/no-unsafe': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-unstable-nested-components
     * @todo No consensus as of yet
     */
    'react/no-unstable-nested-components': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/no-will-update-set-state
     */
    'react/no-will-update-set-state': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/only-export-components
     * @todo No consensus as of yet
     */
    'react/only-export-components': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/prefer-es6-class
     * @todo No consensus as of yet
     */
    'react/prefer-es6-class': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/prefer-function-component
     * @todo No consensus as of yet
     */
    'react/prefer-function-component': 'off',
    // /**
    //  * @see https://oxc.rs/docs/guide/usage/linter/rules/react/react-compiler
    //  * @todo No consensus as of yet
    //  */
    // 'react/react-compiler': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/react-in-jsx-scope
     * @todo No consensus as of yet
     */
    'react/react-in-jsx-scope': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/require-render-return
     * @todo No consensus as of yet
     */
    'react/require-render-return': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/rules-of-hooks
     * @todo No consensus as of yet
     */
    'react/rules-of-hooks': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/self-closing-comp
     * @todo No consensus as of yet
     */
    'react/self-closing-comp': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/state-in-constructor
     * @todo No consensus as of yet
     */
    'react/state-in-constructor': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/style-prop-object
     * @todo No consensus as of yet
     */
    'react/style-prop-object': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react/void-dom-elements-no-children
     */
    'react/void-dom-elements-no-children': 'error',

    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react_perf/jsx-no-jsx-as-prop
     * @todo No consensus as of yet
     */
    'react-perf/jsx-no-jsx-as-prop': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react_perf/jsx-no-new-array-as-prop
     * @todo No consensus as of yet
     */
    'react-perf/jsx-no-new-array-as-prop': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react_perf/jsx-no-new-function-as-prop
     * @todo No consensus as of yet
     */
    'react-perf/jsx-no-new-function-as-prop': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/react_perf/jsx-no-new-object-as-prop
     * @todo No consensus as of yet
     */
    'react-perf/jsx-no-new-object-as-prop': 'error',

    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/alt-text
     */
    'jsx-a11y/alt-text': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/anchor-ambiguous-text
     * @todo No consensus as of yet
     */
    'jsx-a11y/anchor-ambiguous-text': 'off',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/anchor-has-content
     */
    'jsx-a11y/anchor-has-content': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/anchor-is-valid
     */
    'jsx-a11y/anchor-is-valid': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-activedescendant-has-tabindex
     */
    'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-props
     */
    'jsx-a11y/aria-props': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-proptypes
     */
    'jsx-a11y/aria-proptypes': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-role
     */
    'jsx-a11y/aria-role': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/aria-unsupported-elements
     */
    'jsx-a11y/aria-unsupported-elements': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/autocomplete-valid
     */
    'jsx-a11y/autocomplete-valid': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/click-events-have-key-events
     */
    'jsx-a11y/click-events-have-key-events': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/control-has-associated-label
     */
    'jsx-a11y/control-has-associated-label': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/heading-has-content
     */
    'jsx-a11y/heading-has-content': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/html-has-lang
     */
    'jsx-a11y/html-has-lang': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/iframe-has-title
     */
    'jsx-a11y/iframe-has-title': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/img-redundant-alt
     */
    'jsx-a11y/img-redundant-alt': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/interactive-supports-focus
     */
    'jsx-a11y/interactive-supports-focus': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/label-has-associated-control
     */
    'jsx-a11y/label-has-associated-control': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/lang
     */
    'jsx-a11y/lang': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/media-has-caption
     */
    'jsx-a11y/media-has-caption': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/mouse-events-have-key-events
     */
    'jsx-a11y/mouse-events-have-key-events': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-access-key
     */
    'jsx-a11y/no-access-key': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-aria-hidden-on-focusable
     */
    'jsx-a11y/no-aria-hidden-on-focusable': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-autofocus
     */
    'jsx-a11y/no-autofocus': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-distracting-elements
     */
    'jsx-a11y/no-distracting-elements': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-interactive-element-to-noninteractive-role
     */
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-noninteractive-element-interactions
     */
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-noninteractive-element-to-interactive-role
     */
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-noninteractive-tabindex
     */
    'jsx-a11y/no-noninteractive-tabindex': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-redundant-roles
     */
    'jsx-a11y/no-redundant-roles': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/no-static-element-interactions
     */
    'jsx-a11y/no-static-element-interactions': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/prefer-tag-over-role
     */
    'jsx-a11y/prefer-tag-over-role': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/role-has-required-aria-props
     */
    'jsx-a11y/role-has-required-aria-props': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/role-supports-aria-props
     */
    'jsx-a11y/role-supports-aria-props': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/scope
     */
    'jsx-a11y/scope': 'error',
    /**
     * @see https://oxc.rs/docs/guide/usage/linter/rules/jsx_a11y/tabindex-no-positive
     */
    'jsx-a11y/tabindex-no-positive': 'error',
  },
  settings: {
    'jsx-a11y': {
      components: {
        polymorphicPropName: 'as',
      },
    },
    react: {},
  },
})
