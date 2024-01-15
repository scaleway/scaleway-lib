// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react'
import { readPackage } from 'read-pkg'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// const PROFILE = !!process.env.PROFILE

const pkg = await readPackage()

// const external = (id: string) =>
//   [
//     ...Object.keys(pkg.dependencies || {}),
//     ...Object.keys(pkg.peerDependencies || {}),
//     ...['@jest/globals'],
//   ].find(dep => new RegExp(`^${dep}`).test(id))

export default defineConfig({
  build: {
    // outDir: 'vite-dist',
    outDir: 'dist',
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      // external,
      output: {
        preserveModules: true,
      },
    },

    target: ['es2022', 'chrome100', 'node18', 'safari12'],
  },
  plugins: [react(), dts({ rollupTypes: true })],
})
