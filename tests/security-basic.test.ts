import { execSync } from 'node:child_process'
import { filesystem } from 'gluegun'
import { describe, expect, test } from 'vitest'

const src = filesystem.path(__dirname, '..')

const cli = (cmd: string): string => {
  try {
    return execSync(`node ${filesystem.path(src, 'bin', 'mikrus')} ${cmd}`, {
      encoding: 'utf8',
      stdio: 'pipe',
    })
  } catch (error) {
    return error.stderr + error.stdout
  }
}

describe('Core Security Validation', () => {
  test('blocks path traversal with ../', async () => {
    const output = cli('generate ../malicious')
    expect(output).toContain('Path traversal detected')
  })

  test('blocks path traversal with ..\\ (escaped)', async () => {
    const output = cli('generate ..\\\\malicious')
    expect(output).toContain('Path traversal detected')
  })

  test('blocks command injection with semicolon', async () => {
    const output = cli("generate 'foo; rm -rf /'")
    expect(output).toContain('Invalid characters detected')
  })

  test('blocks absolute paths starting with /', async () => {
    const output = cli('generate /absolute/path')
    expect(output).toContain('Absolute paths are not allowed')
  })

  test('blocks absolute paths on Windows (C:)', async () => {
    const output = cli('generate C:\\Windows\\malicious')
    expect(output).toContain('Absolute paths are not allowed')
  })

  test('accepts valid filename', async () => {
    const output = cli('generate valid-name')
    expect(output).toContain('Generated file at models/valid-name-model.ts')
    // Cleanup
    filesystem.remove('models')
  })

  test('provides security error messages', async () => {
    const output = cli('generate ../test')
    expect(output).toContain('Security validation failed')
  })
})
