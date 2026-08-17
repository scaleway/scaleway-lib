import { defineConfig } from 'oxlint'
import eslint from './plugins/eslint'
import importConfig from './plugins/import'
import node from './plugins/node'
import oxc from './plugins/oxc'
import reactConfig from './plugins/react'
import typescript from './plugins/typescript'
import unicorn from './plugins/unicorn'
import vitestConfig from './plugins/vitest'

export const base = defineConfig({
  options: {
    typeAware: true,
    typeCheck: true,
    reportUnusedDisableDirectives: 'error',
  },
  extends: [eslint, importConfig, node, oxc, typescript, unicorn],
})

export const react = defineConfig({
  extends: [reactConfig],
})

export const vitest = defineConfig({
  extends: [vitestConfig],
})

export { ignorePatterns } from './ignorePatterns'
