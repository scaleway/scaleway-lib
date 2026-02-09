/* eslint-disable eslint-comments/disable-enable-pair */

import { mergeConfig } from 'vite'
import { defaultConfig } from '../../vite.config'
import { defaultConfig as vitestDefaultConfig } from '../../vitest.config'

const config = mergeConfig(defaultConfig, vitestDefaultConfig)

export default mergeConfig(config, {
  build: {
    rolldown: {
      platform: 'node',
    },
    ssr: true,
    target: ['node20'],
  },
})
