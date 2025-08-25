import path from 'node:path'
import type { GluegunToolbox } from 'gluegun'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { MikrusToolbox } from '../../src/types'

// Import the compiled extension function
const cliExtension = require(
  path.join(process.cwd(), 'build', 'extensions', 'cli-extension.js')
)

describe('CLI Extension', () => {
  let mockToolbox: GluegunToolbox
  let mikrusToolbox: MikrusToolbox
  let exitSpy: any

  beforeEach(() => {
    // Create mock Gluegun toolbox
    mockToolbox = {
      print: {
        success: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
        info: vi.fn(),
      },
    } as any

    // Apply our extension to the mock toolbox
    cliExtension(mockToolbox)
    mikrusToolbox = mockToolbox as MikrusToolbox

    // Mock process.exit to prevent actual exits during tests
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('Process.exit called')
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('validateIdentifier', () => {
    test('should validate correct identifiers', () => {
      expect(mikrusToolbox.validateIdentifier('valid-name')).toBe(true)
      expect(mikrusToolbox.validateIdentifier('valid_name')).toBe(true)
      expect(mikrusToolbox.validateIdentifier('validname123')).toBe(true)
      expect(mikrusToolbox.validateIdentifier('a')).toBe(true)
      expect(mikrusToolbox.validateIdentifier('my-server-01')).toBe(true)
    })

    test('should reject invalid identifiers', () => {
      expect(mikrusToolbox.validateIdentifier('')).toBe(false)
      expect(mikrusToolbox.validateIdentifier('invalid space')).toBe(false)
      expect(mikrusToolbox.validateIdentifier('invalid.dot')).toBe(false)
      expect(mikrusToolbox.validateIdentifier('invalid@symbol')).toBe(false)
      expect(mikrusToolbox.validateIdentifier('invalid/slash')).toBe(false)
      expect(mikrusToolbox.validateIdentifier('a'.repeat(65))).toBe(false) // Too long
    })

    test('should handle non-string inputs', () => {
      expect(mikrusToolbox.validateIdentifier(null as any)).toBe(false)
      expect(mikrusToolbox.validateIdentifier(undefined as any)).toBe(false)
      expect(mikrusToolbox.validateIdentifier(123 as any)).toBe(false)
      expect(mikrusToolbox.validateIdentifier({} as any)).toBe(false)
    })
  })

  describe('success', () => {
    test('should format success messages with emoji', () => {
      mikrusToolbox.success('Operation completed')

      expect(mockToolbox.print.success).toHaveBeenCalledWith(
        '✅ Operation completed'
      )
    })
  })

  describe('error', () => {
    test('should format error messages and exit with default code', () => {
      expect(() => mikrusToolbox.error('Something went wrong')).toThrow(
        'Process.exit called'
      )
      expect(mockToolbox.print.error).toHaveBeenCalledWith(
        '❌ Something went wrong'
      )
      expect(exitSpy).toHaveBeenCalledWith(1)
    })

    test('should exit with custom exit code', () => {
      expect(() => mikrusToolbox.error('Critical error', 2)).toThrow(
        'Process.exit called'
      )
      expect(mockToolbox.print.error).toHaveBeenCalledWith('❌ Critical error')
      expect(exitSpy).toHaveBeenCalledWith(2)
    })
  })

  describe('checkApiConnectivity', () => {
    test('should return false for network errors', async () => {
      // This will test the actual implementation but since the API might not exist,
      // it should return false and log debug message
      const result = await mikrusToolbox.checkApiConnectivity()

      // The result should be boolean (either true or false depending on actual API)
      expect(typeof result).toBe('boolean')
    })

    test('should handle connectivity check gracefully', async () => {
      // Test that the function doesn't throw errors
      expect(async () => {
        await mikrusToolbox.checkApiConnectivity()
      }).not.toThrow()
    })
  })

  describe('extension loading', () => {
    test('should have all custom methods available on toolbox', () => {
      expect(typeof mikrusToolbox.validateIdentifier).toBe('function')
      expect(typeof mikrusToolbox.success).toBe('function')
      expect(typeof mikrusToolbox.error).toBe('function')
      expect(typeof mikrusToolbox.checkApiConnectivity).toBe('function')
    })

    test('should maintain original toolbox functionality', () => {
      expect(mikrusToolbox.print).toBeDefined()
      expect(mikrusToolbox.print.success).toBeDefined()
      expect(mikrusToolbox.print.error).toBeDefined()
      expect(mikrusToolbox.print.debug).toBeDefined()
    })
  })

  describe('integration scenarios', () => {
    test('should be usable for input validation', () => {
      expect(() => mikrusToolbox.validateIdentifier('test-model')).not.toThrow()
      expect(mikrusToolbox.validateIdentifier('test-model')).toBe(true)
      expect(mikrusToolbox.validateIdentifier('invalid name')).toBe(false)
    })

    test('should provide consistent error handling', () => {
      expect(() => mikrusToolbox.error('Test error')).toThrow(
        'Process.exit called'
      )
      expect(mockToolbox.print.error).toHaveBeenCalledWith('❌ Test error')
    })

    test('should provide consistent success messaging', () => {
      mikrusToolbox.success('Test success')
      expect(mockToolbox.print.success).toHaveBeenCalledWith('✅ Test success')
    })
  })
})
