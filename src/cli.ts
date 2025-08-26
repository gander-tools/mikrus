import { Command } from "@cliffy/command";
import { generateCommand } from "./commands/generate.ts";

/**
 * Creates and runs the mikrus CLI using Cliffy framework
 *
 * This function initializes the Cliffy CLI with mikrus-specific configuration:
 * - Sets up the main command with name and description
 * - Registers the generate subcommand
 * - Provides automatic help and version commands
 * - Runs the CLI with provided arguments
 *
 * @param args - Command line arguments array (typically Deno.args)
 * @returns Promise resolving when CLI execution completes
 */
async function run(args: string[] = Deno.args): Promise<void> {
  // Create main CLI command
  const cli = new Command()
    .name("mikrus")
    .version("0.0.1")
    .description("Command-line interface tool for managing VPS servers on mikr.us platform")
    // Register generate command
    .command("generate", generateCommand);

  // Execute the CLI with provided arguments
  await cli.parse(args);
}

// Export for programmatic usage and testing
export { run };

// Run CLI if this is the main module
if (import.meta.main) {
  await run();
}