import { Command } from "@cliffy/command";
import { red, yellow } from "jsr:@std/fmt@1.0.8/colors";
import { generateCommand } from "./commands/generate.ts";
import { GIT_HASH, VERSION } from "./version.ts";

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
    // Check if internal mode is enabled (for hidden commands)
    const internalMode = Deno.env.get("MIKRUS_INTERNAL") === "true" ||
      args.includes("--internal");

    // Create main CLI command with enhanced configuration
    const cli = new Command()
      .name("mikrus")
      .description(
        "Command-line interface tool for managing VPS servers on mikr.us platform",
      )
      .version(`${VERSION} (${GIT_HASH})`)
      // Global options
      .globalOption(
        "--verbose, -v",
        "Enable verbose output for debugging",
      )
      .globalOption(
        "--quiet, -q",
        "Suppress non-essential output",
      )
      .globalOption("--config <path>", "Path to configuration file");

    // Only register generate command in internal mode
    if (internalMode) {
      cli
        .command("generate", generateCommand)
        .hidden(); // Mark as hidden command
    }

    // Custom error handling
    cli.error((error, _cmd) => {
      if (error instanceof Error) {
        console.error(red("✗ Error:"), error.message);

        // Provide helpful suggestions for common errors
        if (error.message.includes("Unknown command")) {
          console.log(yellow("\n💡 Try: mikrus --help"));
        }
      } else {
        console.error(red("✗ An unexpected error occurred"));
      }

      Deno.exit(1);
    });

    // Execute the CLI with provided arguments
    // Show help if no arguments provided
    if (args.length === 0) {
      await cli.showHelp();
      return;
    }

    await cli.parse(args);
  } catch (error) {
    // Check if it's a help request (Cliffy throws an error for help)
    if (error instanceof Error && error.message.includes("HELP")) {
      return; // Help was shown, exit normally
    }

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
