import type { GluegunToolbox } from 'gluegun'
import { describe, expect, test, vi } from 'vitest'

describe('Generate Command Security Tests', () => {
  // Mock setup helper
  const createMockToolbox = (first?: string): GluegunToolbox =>
    ({
      parameters: { first },
      template: { generate: vi.fn() },
      print: { info: vi.fn(), error: vi.fn() },
    }) as unknown as GluegunToolbox

  const mockProcessExit = () => {
    return vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called')
    })
  }

  describe('Input Validation Edge Cases', () => {
    test('should reject empty string input', async () => {
      const toolbox = createMockToolbox('   ') // Only whitespace
      const mockExit = mockProcessExit()

      const generateCommand = await import('../src/commands/generate')

      await expect(generateCommand.run(toolbox)).rejects.toThrow(
        'process.exit called'
      )
      expect(toolbox.print.error).toHaveBeenCalledWith(
        expect.stringContaining('Name parameter cannot be empty')
      )

      mockExit.mockRestore()
    })

    test('should reject null input', async () => {
      const toolbox = createMockToolbox(null as any)
      const mockExit = mockProcessExit()

      const generateCommand = await import('../src/commands/generate')

      await expect(generateCommand.run(toolbox)).rejects.toThrow(
        'process.exit called'
      )
      expect(toolbox.print.error).toHaveBeenCalledWith(
        expect.stringContaining(
          'Name parameter is required and must be a string'
        )
      )

      mockExit.mockRestore()
    })

    test('should reject non-string input', async () => {
      const toolbox = createMockToolbox(123 as any)
      const mockExit = mockProcessExit()

      const generateCommand = await import('../src/commands/generate')

      await expect(generateCommand.run(toolbox)).rejects.toThrow(
        'process.exit called'
      )
      expect(toolbox.print.error).toHaveBeenCalledWith(
        expect.stringContaining(
          'Name parameter is required and must be a string'
        )
      )

      mockExit.mockRestore()
    })
  })

  describe('Path Traversal Protection', () => {
    test('should reject path traversal with ../', async () => {
      const toolbox = createMockToolbox('../malicious-file')
      const mockExit = mockProcessExit()

      const generateCommand = await import('../src/commands/generate')

      await expect(generateCommand.run(toolbox)).rejects.toThrow(
        'process.exit called'
      )
      expect(toolbox.print.error).toHaveBeenCalledWith(
        expect.stringContaining('Path traversal detected')
      )

      mockExit.mockRestore()
    })

    test('should reject path traversal with ..\\', async () => {
      const toolbox = createMockToolbox('..\\malicious-file')
      const mockExit = mockProcessExit()

      const generateCommand = await import('../src/commands/generate')

      await expect(generateCommand.run(toolbox)).rejects.toThrow(
        'process.exit called'
      )
      expect(toolbox.print.error).toHaveBeenCalledWith(
        expect.stringContaining('Path traversal detected')
      )

      mockExit.mockRestore()
    })

    test('should reject embedded .. sequences', async () => {
      const toolbox = createMockToolbox('some..sequence')
      const mockExit = mockProcessExit()

      const generateCommand = await import('../src/commands/generate')

      await expect(generateCommand.run(toolbox)).rejects.toThrow(
        'process.exit called'
      )
      expect(toolbox.print.error).toHaveBeenCalledWith(
        expect.stringContaining('Path traversal detected')
      )

      mockExit.mockRestore()
    })
  })

  describe('Absolute Path Protection', () => {
    test('should reject Unix absolute paths', async () => {
      const toolbox = createMockToolbox('/etc/passwd')
      const mockExit = mockProcessExit()

      const generateCommand = await import('../src/commands/generate')

      await expect(generateCommand.run(toolbox)).rejects.toThrow(
        'process.exit called'
      )
      expect(toolbox.print.error).toHaveBeenCalledWith(
        expect.stringContaining('Absolute paths are not allowed')
      )

      mockExit.mockRestore()
    })

    test('should reject Windows absolute paths', async () => {
      const toolbox = createMockToolbox('C:\\Windows\\System32\\evil.exe')
      const mockExit = mockProcessExit()

      const generateCommand = await import('../src/commands/generate')

      await expect(generateCommand.run(toolbox)).rejects.toThrow(
        'process.exit called'
      )
      expect(toolbox.print.error).toHaveBeenCalledWith(
        expect.stringContaining('Absolute paths are not allowed')
      )

      mockExit.mockRestore()
    })

    test('should reject backslash paths', async () => {
      const toolbox = createMockToolbox('\\malicious\\path')
      const mockExit = mockProcessExit()

      const generateCommand = await import('../src/commands/generate')

      await expect(generateCommand.run(toolbox)).rejects.toThrow(
        'process.exit called'
      )
      expect(toolbox.print.error).toHaveBeenCalledWith(
        expect.stringContaining('Absolute paths are not allowed')
      )

      mockExit.mockRestore()
    })
  })

  describe('Command Injection Protection', () => {
    test('should reject shell metacharacters', async () => {
      const dangerousInputs = [
        'file; rm -rf /',
        'file | cat /etc/passwd',
        'file && evil-command',
        'file$(malicious)',
        'file`malicious`',
        'file<script>',
        "file'injection",
        'file"injection',
        'file\\injection',
      ]

      for (const input of dangerousInputs) {
        const toolbox = createMockToolbox(input)
        const mockExit = mockProcessExit()

        const generateCommand = await import('../src/commands/generate')

        await expect(generateCommand.run(toolbox)).rejects.toThrow(
          'process.exit called'
        )
        expect(toolbox.print.error).toHaveBeenCalledWith(
          expect.stringContaining('Invalid characters detected')
        )

        mockExit.mockRestore()
      }
    })
  })

  describe('File System Reserved Characters', () => {
    test('should reject reserved filesystem characters', async () => {
      // These characters are caught by command injection protection first
      const shellMetaChars = [
        'file<name',
        'file>name',
        'file"name',
        'file|name',
      ]

      for (const input of shellMetaChars) {
        const toolbox = createMockToolbox(input)
        const mockExit = mockProcessExit()

        const generateCommand = await import('../src/commands/generate')

        await expect(generateCommand.run(toolbox)).rejects.toThrow(
          'process.exit called'
        )
        expect(toolbox.print.error).toHaveBeenCalledWith(
          expect.stringContaining('Invalid characters detected')
        )

        mockExit.mockRestore()
      }

      // These characters are specifically reserved filesystem chars
      const fsReservedChars = [
        'file:name',
        'file/name',
        'file?name',
        'file*name',
      ]

      for (const input of fsReservedChars) {
        const toolbox = createMockToolbox(input)
        const mockExit = mockProcessExit()

        const generateCommand = await import('../src/commands/generate')

        await expect(generateCommand.run(toolbox)).rejects.toThrow(
          'process.exit called'
        )
        expect(toolbox.print.error).toHaveBeenCalledWith(
          expect.stringContaining('reserved file system characters')
        )

        mockExit.mockRestore()
      }
    })
  })

  describe('Length Validation', () => {
    test('should reject extremely long input', async () => {
      const longInput = 'a'.repeat(101) // Exceeds 100 char limit
      const toolbox = createMockToolbox(longInput)
      const mockExit = mockProcessExit()

      const generateCommand = await import('../src/commands/generate')

      await expect(generateCommand.run(toolbox)).rejects.toThrow(
        'process.exit called'
      )
      expect(toolbox.print.error).toHaveBeenCalledWith(
        expect.stringContaining('Name parameter is too long')
      )

      mockExit.mockRestore()
    })

    test('should accept input at maximum length', async () => {
      const maxInput = 'a'.repeat(100) // Exactly 100 chars
      const toolbox = createMockToolbox(maxInput)

      const generateCommand = await import('../src/commands/generate')

      await generateCommand.run(toolbox)

      expect(toolbox.template.generate).toHaveBeenCalledWith({
        template: 'model.ts.ejs',
        target: `models/${maxInput}-model.ts`,
        props: { name: maxInput },
      })
      expect(toolbox.print.error).not.toHaveBeenCalled()
    })
  })

  describe('Valid Pattern Enforcement', () => {
    test('should reject invalid characters in filename', async () => {
      const invalidInputs = [
        'file with spaces',
        'file@symbol',
        'file#hash',
        'file%percent',
        'file(parentheses)',
        'file[brackets]',
        'file{braces}',
        'file+plus',
      ]

      for (const input of invalidInputs) {
        const toolbox = createMockToolbox(input)
        const mockExit = mockProcessExit()

        const generateCommand = await import('../src/commands/generate')

        await expect(generateCommand.run(toolbox)).rejects.toThrow(
          'process.exit called'
        )
        expect(toolbox.print.error).toHaveBeenCalledWith(
          expect.stringContaining(
            'must contain only letters, numbers, hyphens, and underscores'
          )
        )

        mockExit.mockRestore()
      }
    })

    test('should accept valid filename patterns', async () => {
      const validInputs = [
        'simple-file',
        'file_with_underscores',
        'CamelCaseFile',
        'file123',
        'a',
        'FILE-NAME-123_TEST',
      ]

      for (const input of validInputs) {
        const toolbox = createMockToolbox(input)

        const generateCommand = await import('../src/commands/generate')

        await generateCommand.run(toolbox)

        expect(toolbox.template.generate).toHaveBeenCalledWith({
          template: 'model.ts.ejs',
          target: `models/${input}-model.ts`,
          props: { name: input },
        })
        expect(toolbox.print.error).not.toHaveBeenCalled()
      }
    })
  })

  describe('Error Handling Edge Cases', () => {
    test('should handle template generation failure gracefully', async () => {
      const toolbox = createMockToolbox('valid-name')
      const mockExit = mockProcessExit()

      // Mock template.generate to throw an error
      vi.mocked(toolbox.template.generate).mockRejectedValue(
        new Error('Template file not found')
      )

      const generateCommand = await import('../src/commands/generate')

      await expect(generateCommand.run(toolbox)).rejects.toThrow(
        'process.exit called'
      )
      expect(toolbox.print.error).toHaveBeenCalledWith(
        expect.stringContaining('Security validation failed')
      )

      mockExit.mockRestore()
    })

    test('should handle non-Error exceptions', async () => {
      const toolbox = createMockToolbox('valid-name')
      const mockExit = mockProcessExit()

      // Mock template.generate to throw a non-Error object
      vi.mocked(toolbox.template.generate).mockRejectedValue('String error')

      const generateCommand = await import('../src/commands/generate')

      await expect(generateCommand.run(toolbox)).rejects.toThrow(
        'process.exit called'
      )
      expect(toolbox.print.error).toHaveBeenCalledWith(
        expect.stringContaining('Security validation failed: String error')
      )

      mockExit.mockRestore()
    })
  })

  describe('Whitespace Handling', () => {
    test('should trim whitespace from input', async () => {
      const toolbox = createMockToolbox('  valid-name  ')

      const generateCommand = await import('../src/commands/generate')

      await generateCommand.run(toolbox)

      expect(toolbox.template.generate).toHaveBeenCalledWith({
        template: 'model.ts.ejs',
        target: 'models/valid-name-model.ts',
        props: { name: 'valid-name' },
      })
      expect(toolbox.print.info).toHaveBeenCalledWith(
        'Generated file at models/valid-name-model.ts'
      )
    })
  })
})
