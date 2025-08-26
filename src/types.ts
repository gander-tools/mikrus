/**
 * CLI command options interface for Deno/Cliffy
 */
export interface MikrusCommandOptions {
  name?: string;
  help?: boolean;
  version?: boolean;
}

/**
 * Generate command parameters
 */
export interface GenerateCommandParams {
  name?: string;
}

/**
 * Utility functions for CLI operations
 */
export interface MikrusUtils {
  /**
   * Validates that a string is a valid identifier (letters, numbers, hyphens, underscores)
   * @param name - The identifier to validate
   * @returns True if valid, false otherwise
   */
  validateIdentifier(name: string): boolean;

  /**
   * Creates a formatted success message with emoji
   * @param message - The success message to display
   */
  success(message: string): void;

  /**
   * Creates a formatted error message with emoji and exits
   * @param message - The error message to display
   * @param exitCode - The exit code (default: 1)
   */
  error(message: string, exitCode?: number): never;

  /**
   * Checks if mikr.us API is reachable
   * @returns Promise that resolves to true if API is reachable
   */
  checkApiConnectivity(): Promise<boolean>;
}

/**
 * Template generation parameters
 */
export interface TemplateGenerationProps {
  name: string;
  template: string;
  target: string;
}
