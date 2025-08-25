import { describe, expect, test, vi } from 'vitest'

// Mock gluegun build function
const mockCliInstance = {
  brand: vi.fn().mockReturnThis(),
  src: vi.fn().mockReturnThis(),
  plugins: vi.fn().mockReturnThis(),
  help: vi.fn().mockReturnThis(),
  version: vi.fn().mockReturnThis(),
  create: vi.fn().mockReturnThis(),
  run: vi.fn().mockResolvedValue({ print: { info: vi.fn() } }),
}

const mockBuild = vi.fn(() => mockCliInstance)

vi.mock('gluegun', () => ({
  build: mockBuild,
}))

describe('CLI Unit Tests', () => {
  test('run function configures CLI correctly', async () => {
    // Import after mocking
    const { run } = await import('../src/cli')

    const testArgv = ['node', 'mikrus', '--version']
    await run(testArgv)

    // Verify CLI configuration chain
    expect(mockBuild).toHaveBeenCalledOnce()
    expect(mockCliInstance.brand).toHaveBeenCalledWith('mikrus')
    expect(mockCliInstance.src).toHaveBeenCalledWith(
      __dirname.replace('/tests', '/src')
    )
    expect(mockCliInstance.plugins).toHaveBeenCalledWith('./node_modules', {
      matching: 'mikrus-*',
      hidden: true,
    })
    expect(mockCliInstance.help).toHaveBeenCalledOnce()
    expect(mockCliInstance.version).toHaveBeenCalledOnce()
    expect(mockCliInstance.create).toHaveBeenCalledOnce()
    expect(mockCliInstance.run).toHaveBeenCalledWith(testArgv)
  })

  test('run function returns toolbox result', async () => {
    const { run } = await import('../src/cli')

    const testArgv = ['node', 'mikrus', '--help']
    const expectedToolbox = { print: { info: vi.fn() } }
    mockCliInstance.run.mockResolvedValueOnce(expectedToolbox)

    const result = await run(testArgv)

    expect(result).toBe(expectedToolbox)
  })

  test('run function handles empty argv', async () => {
    const { run } = await import('../src/cli')

    const emptyArgv: string[] = []
    await run(emptyArgv)

    expect(mockCliInstance.run).toHaveBeenCalledWith(emptyArgv)
  })

  test('run function handles typical CLI arguments', async () => {
    const { run } = await import('../src/cli')

    const typicalArgv = ['node', '/path/to/mikrus', 'generate', 'test-model']
    await run(typicalArgv)

    expect(mockCliInstance.run).toHaveBeenCalledWith(typicalArgv)
  })
})
