import type { GluegunToolbox } from 'gluegun'
import { describe, expect, test, vi } from 'vitest'

describe('Mikrus Command Unit Tests', () => {
  test('mikrus command prints welcome message', async () => {
    const mockPrint = {
      info: vi.fn(),
    }

    const mockToolbox = {
      print: mockPrint,
    } as unknown as GluegunToolbox

    // Dynamic import for TypeScript modules (CommonJS export)
    const command = await import('../src/commands/mikrus')

    expect(command.name).toBe('mikrus')
    expect(typeof command.run).toBe('function')

    // Execute the command
    await command.run(mockToolbox)

    // Verify the welcome message
    expect(mockPrint.info).toHaveBeenCalledWith('Welcome to your CLI')
    expect(mockPrint.info).toHaveBeenCalledTimes(1)
  })

  test('generate command has correct configuration', async () => {
    const generateCommand = await import('../src/commands/generate')

    expect(generateCommand.name).toBe('generate')
    expect(generateCommand.alias).toEqual(['g'])
    expect(typeof generateCommand.run).toBe('function')
  })

  test('generate command validates input parameters', async () => {
    const mockPrint = {
      info: vi.fn(),
      error: vi.fn(),
    }

    const mockGenerate = vi.fn()

    const mockToolbox = {
      parameters: {
        first: undefined, // No parameter provided
      },
      template: {
        generate: mockGenerate,
      },
      print: mockPrint,
    } as unknown as GluegunToolbox

    // Mock process.exit to prevent test termination
    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called')
    })

    const generateCommand = await import('../src/commands/generate')

    // Should throw because process.exit is called
    await expect(generateCommand.run(mockToolbox)).rejects.toThrow(
      'process.exit called'
    )

    // Verify error handling
    expect(mockPrint.error).toHaveBeenCalledWith(
      expect.stringContaining('Security validation failed')
    )
    expect(mockGenerate).not.toHaveBeenCalled()
    expect(mockExit).toHaveBeenCalledWith(1)

    mockExit.mockRestore()
  })

  test('generate command processes valid input', async () => {
    const mockPrint = {
      info: vi.fn(),
      error: vi.fn(),
    }

    const mockGenerate = vi.fn()

    const mockToolbox = {
      parameters: {
        first: 'valid-model-name',
      },
      template: {
        generate: mockGenerate,
      },
      print: mockPrint,
    } as unknown as GluegunToolbox

    const generateCommand = await import('../src/commands/generate')

    await generateCommand.run(mockToolbox)

    // Verify template generation
    expect(mockGenerate).toHaveBeenCalledWith({
      template: 'model.ts.ejs',
      target: 'models/valid-model-name-model.ts',
      props: { name: 'valid-model-name' },
    })

    // Verify success message
    expect(mockPrint.info).toHaveBeenCalledWith(
      'Generated file at models/valid-model-name-model.ts'
    )
    expect(mockPrint.error).not.toHaveBeenCalled()
  })
})
