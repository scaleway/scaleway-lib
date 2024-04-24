/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-relative-packages */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { defineConfig, mergeConfig } from 'vite'
import { defaultConfig } from '../../vite.config'

export default mergeConfig(defineConfig(defaultConfig), {
  build: {
    target: ['node20'],
  },
})
