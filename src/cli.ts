import { Command } from "@cliffy/command";
import { red, yellow } from "jsr:@std/fmt@1.0.8/colors";
import { generateCommand } from "./commands/generate.ts";

/**
 * Creates and runs the mikrus CLI using Cliffy framework
 *
 * This function initializes the Cliffy CLI with mikrus-specific configuration:
 * - Sets up the main command with name and description
 * - Registers the generate subcommand
 * - Provides automatic help and version commands
 * - Includes enhanced error handling and user experience
 * - Runs the CLI with provided arguments
 *
 * @param args - Command line arguments array (typically Deno.args)
 * @returns Promise resolving when CLI execution completes
 */
async function run(args: string[] = Deno.args): Promise<void> {
  try {
    // Create main CLI command with enhanced configuration
    const cli = new Command()
      .name("mikrus")
      .version("0.0.1")
      .description(
        "Command-line interface tool for managing VPS servers on mikr.us platform",
      )
      // Enhanced help with examples
      .example(
        "Generate a model file",
        "mikrus generate user",
      )
      .example(
        "Show help for generate command",
        "mikrus generate --help",
      )
      // Global options
      .globalOption(
        "--verbose, -v",
        "Enable verbose output for debugging",
      )
      .globalOption(
        "--quiet, -q",
        "Suppress non-essential output",
      )
      // Add global CLI options
      // .globalOption("--verbose, -v", "Enable verbose output")
      .globalOption("--config <path>", "Path to configuration file")
      // Register generate command
      .command("generate", generateCommand)
      // Custom error handling
      .error((error, _cmd) => {
        if (error instanceof Error) {
          console.error(red("✗ Error:"), error.message);

          // Provide helpful suggestions for common errors
          if (error.message.includes("Unknown command")) {
            console.log(yellow("\n💡 Available commands:"));
            console.log("  generate  Generate a new model file from template");
            console.log("\nTry: mikrus --help");
          }
        } else {
          console.error(red("✗ An unexpected error occurred"));
        }

        Deno.exit(1);
      });

    // Execute the CLI with provided arguments
    await cli.parse(args);
  } catch (error) {
    // Global error handler for unhandled exceptions
    console.error(
      red("✗ Fatal error:"),
      error instanceof Error ? error.message : "Unknown error",
    );
    console.log(
      yellow(
        "💡 Please report this issue at: https://github.com/gander-tools/mikrus/issues",
      ),
    );
    Deno.exit(1);
  }
}

// Export for programmatic usage and testing
export { run };

// Run CLI if this is the main module
if (import.meta.main) {
  await run();
}
