import { VitestReporter } from 'tdd-guard-vitest'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.test.ts', '**/tests/**/*.test.ts'],
    globals: true,
    reporters: ['default', new VitestReporter(process.cwd())],
  },
})
