import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      'src/**/*.test.ts',
      'examples/**/*.test.ts'
    ],
    alias: {
      'ayyws': 'dist'
    }
  }
})
