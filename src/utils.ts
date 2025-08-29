import type { MikrusUtils } from "./types.ts";

/**
 * Default configuration constants
 */
const DEFAULT_MIKRUS_API_URL = "https://api.mikr.us";

/**
 * Validates and sanitizes user input to prevent security vulnerabilities
 */
export function validateAndSanitizeInput(input: string | undefined): string {
  // Check if input is provided
  if (!input || typeof input !== "string") {
    throw new Error("Name parameter is required and must be a string");
  }

  // Trim whitespace
  const trimmed = input.trim();

  // Check for empty input after trimming
  if (trimmed.length === 0) {
    throw new Error("Name parameter cannot be empty");
  }

  // Path traversal protection - prevent directory traversal attacks
  if (
    trimmed.includes("../") ||
    trimmed.includes("..\\") ||
    trimmed.includes("..")
  ) {
    throw new Error(
      'Path traversal detected. Name parameter cannot contain ".." sequences',
    );
  }

  // Absolute path protection
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("\\") ||
    /^[a-zA-Z]:/.test(trimmed)
  ) {
    throw new Error(
      "Absolute paths are not allowed. Name parameter must be a relative filename",
    );
  }

  // Command injection protection - remove dangerous shell metacharacters
  const dangerousChars = /[;|&$`<>'"\\]/;
  if (dangerousChars.test(trimmed)) {
    throw new Error(
      "Invalid characters detected. Name parameter cannot contain: ; | & $ ` < > ' \" \\",
    );
  }

  // File system reserved characters protection
  const reservedChars = /[<>:"/|?*]/;
  if (reservedChars.test(trimmed)) {
    throw new Error("Name parameter contains reserved file system characters");
  }

  // Length validation
  if (trimmed.length > 100) {
    throw new Error(
      "Name parameter is too long. Maximum length is 100 characters",
    );
  }

  // Valid filename pattern - alphanumeric, hyphens, underscores only
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(trimmed)) {
    throw new Error(
      "Name parameter must contain only letters, numbers, hyphens, and underscores",
    );
  }

  return trimmed;
}

/**
 * Utility functions for CLI operations
 */
export const utils: MikrusUtils = {
  /**
   * Validates that a string is a valid identifier using comprehensive security validation
   * @param name - The identifier to validate
   * @returns True if valid, false otherwise
   */
  validateIdentifier: (name: string): boolean => {
    try {
      validateAndSanitizeInput(name);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Creates a formatted success message with emoji
   * @param message - The success message to display
   */
  success: (message: string): void => {
    console.log(`✅ ${message}`);
  },

  /**
   * Creates a formatted error message with emoji and exits
   * @param message - The error message to display
   * @param exitCode - The exit code (default: 1)
   */
  error: (message: string, exitCode = 1): never => {
    console.error(`❌ ${message}`);
    Deno.exit(exitCode);
  },

  /**
   * Checks if mikr.us API is reachable using Deno's native fetch
   * @returns Promise that resolves to true if API is reachable
   */
  checkApiConnectivity: async (): Promise<boolean> => {
    try {
      // Use environment variable for API endpoint, fallback to default
      let apiEndpoint = DEFAULT_MIKRUS_API_URL;
      try {
        apiEndpoint = Deno.env.get("MIKRUS_API_URL") ?? DEFAULT_MIKRUS_API_URL;
      } catch {
        // Env access not available (no --allow-env flag), use default
        apiEndpoint = DEFAULT_MIKRUS_API_URL;
      }

      const response = await fetch(apiEndpoint, {
        method: "HEAD",
        headers: { "User-Agent": "mikrus-cli" }, // Remove version to avoid disclosure
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      return response.status >= 200 && response.status < 400;
    } catch (error) {
      console.debug(
        `API connectivity check failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return false;
    }
  },
};
