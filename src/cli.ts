import { build, type GluegunToolbox } from 'gluegun'

/**
 * Creates and runs the mikrus CLI
 *
 * This function initializes the Gluegun CLI runtime with mikrus-specific configuration:
 * - Sets up the CLI brand and source directory
 * - Configures plugin loading from node_modules
 * - Enables default help and version commands
 * - Runs the CLI with provided arguments
 *
 * @param argv - Command line arguments array (typically process.argv)
 * @returns Promise resolving to the Gluegun toolbox instance
 *
 * @example
 * ```typescript
 * // Run CLI with process arguments
 * const toolbox = await run(process.argv)
 *
 * // Run CLI with custom arguments
 * const toolbox = await run(['node', 'mikrus', 'generate', 'my-model'])
 * ```
 */
async function run(argv: string[]): Promise<GluegunToolbox> {
  // Create a CLI runtime with mikrus configuration
  const cli = build()
    .brand('mikrus')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'mikrus-*', hidden: true })
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .create()

  // Performance optimization note:
  // You can exclude unused Gluegun extensions to improve startup time:
  // .exclude(['meta', 'strings', 'print', 'filesystem', 'semver', 'system', 'prompt', 'http', 'template', 'patching', 'package-manager'])

  // Execute the CLI with provided arguments
  const toolbox = await cli.run(argv)

  // Return toolbox for testing and programmatic usage
  return toolbox
}

module.exports = { run }
