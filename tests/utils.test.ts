import { assertEquals, assertThrows } from "@std/testing/asserts";
import {
  afterEach,
  beforeEach,
  describe,
  it,
} from "jsr:@std/testing@1.0.8/bdd";
import { utils, validateAndSanitizeInput } from "../src/utils.ts";

describe("Utils Module", () => {
  describe("validateAndSanitizeInput", () => {
    it("should accept valid inputs", () => {
      assertEquals(validateAndSanitizeInput("valid-name"), "valid-name");
      assertEquals(validateAndSanitizeInput("user_data"), "user_data");
      assertEquals(validateAndSanitizeInput("Model123"), "Model123");
      assertEquals(validateAndSanitizeInput(" trimmed "), "trimmed");
    });

    it("should reject invalid inputs", () => {
      assertThrows(() => validateAndSanitizeInput(undefined));
      assertThrows(() => validateAndSanitizeInput(""));
      assertThrows(() => validateAndSanitizeInput("   "));
      assertThrows(() => validateAndSanitizeInput("../malicious"));
      assertThrows(() => validateAndSanitizeInput("/absolute/path"));
      assertThrows(() => validateAndSanitizeInput("C:\\windows\\path"));
      assertThrows(() => validateAndSanitizeInput("file; rm -rf /"));
      assertThrows(() => validateAndSanitizeInput("file with spaces"));
      assertThrows(() => validateAndSanitizeInput("file*with*reserved"));
    });

    it("should validate length correctly", () => {
      const longName = "a".repeat(101);
      assertThrows(() => validateAndSanitizeInput(longName));

      const maxLengthName = "a".repeat(100);
      assertEquals(validateAndSanitizeInput(maxLengthName), maxLengthName);
    });

    it("should handle Unicode attack vectors", () => {
      // Test various Unicode normalization attacks
      assertThrows(() => validateAndSanitizeInput("file\u0000null"));
      assertThrows(() => validateAndSanitizeInput("file\u202Ehidden"));
      assertThrows(() => validateAndSanitizeInput("file\uFEFFbom"));

      // Test Unicode directory traversal attempts
      assertThrows(() =>
        validateAndSanitizeInput("file\u002E\u002E/traversal")
      );
      assertThrows(() => validateAndSanitizeInput("file\uFF0E\uFF0E/unicode"));
    });

    it("should handle edge cases", () => {
      // Test single character edge cases
      assertEquals(validateAndSanitizeInput("a"), "a");
      assertEquals(validateAndSanitizeInput("1"), "1");
      assertEquals(validateAndSanitizeInput("-"), "-");
      assertEquals(validateAndSanitizeInput("_"), "_");

      // Test boundary conditions
      assertThrows(() => validateAndSanitizeInput("."));
      assertThrows(() => validateAndSanitizeInput(".."));
      assertThrows(() => validateAndSanitizeInput("..."));
    });
  });

  describe("utils.validateIdentifier", () => {
    it("should validate correct identifiers", () => {
      assertEquals(utils.validateIdentifier("valid-name"), true);
      assertEquals(utils.validateIdentifier("user_data"), true);
      assertEquals(utils.validateIdentifier("Model123"), true);
      assertEquals(utils.validateIdentifier("a"), true);
    });

    it("should reject invalid identifiers", () => {
      assertEquals(utils.validateIdentifier(""), false);
      assertEquals(utils.validateIdentifier("   "), false);
      assertEquals(utils.validateIdentifier("file with spaces"), false);
      assertEquals(utils.validateIdentifier("file*with*reserved"), false);
      assertEquals(utils.validateIdentifier("../malicious"), false);
      assertEquals(utils.validateIdentifier("/absolute"), false);
    });

    it("should respect length limits", () => {
      const longName = "a".repeat(101);
      assertEquals(utils.validateIdentifier(longName), false);

      const maxLengthName = "a".repeat(100);
      assertEquals(utils.validateIdentifier(maxLengthName), true);
    });
  });

  describe("utils.success", () => {
    let consoleLogSpy: string[] = [];
    const originalConsoleLog = console.log;

    beforeEach(() => {
      consoleLogSpy = [];
      console.log = (...args: unknown[]) => {
        consoleLogSpy.push(args.join(" "));
      };
    });

    afterEach(() => {
      console.log = originalConsoleLog;
    });

    it("should print success message with emoji", () => {
      utils.success("Operation completed");
      assertEquals(consoleLogSpy.length, 1);
      assertEquals(consoleLogSpy[0], "✅ Operation completed");
    });

    it("should handle empty message", () => {
      utils.success("");
      assertEquals(consoleLogSpy.length, 1);
      assertEquals(consoleLogSpy[0], "✅ ");
    });

    it("should handle multiline message", () => {
      utils.success("Line 1\nLine 2");
      assertEquals(consoleLogSpy.length, 1);
      assertEquals(consoleLogSpy[0], "✅ Line 1\nLine 2");
    });
  });

  describe("utils.error", () => {
    let consoleErrorSpy: string[] = [];
    let exitCode: number | undefined;
    const originalConsoleError = console.error;
    const originalDenoExit = Deno.exit;

    beforeEach(() => {
      consoleErrorSpy = [];
      exitCode = undefined;
      console.error = (...args: unknown[]) => {
        consoleErrorSpy.push(args.join(" "));
      };
      // @ts-ignore: Mocking Deno.exit for testing
      Deno.exit = (code?: number) => {
        exitCode = code;
        throw new Error(`Process exited with code ${code}`);
      };
    });

    afterEach(() => {
      console.error = originalConsoleError;
      Deno.exit = originalDenoExit;
    });

    it("should print error message with emoji and exit with code 1", () => {
      assertThrows(
        () => utils.error("Operation failed"),
        Error,
        "Process exited with code 1",
      );
      assertEquals(consoleErrorSpy.length, 1);
      assertEquals(consoleErrorSpy[0], "❌ Operation failed");
      assertEquals(exitCode, 1);
    });

    it("should exit with custom exit code", () => {
      assertThrows(
        () => utils.error("Critical failure", 2),
        Error,
        "Process exited with code 2",
      );
      assertEquals(consoleErrorSpy.length, 1);
      assertEquals(consoleErrorSpy[0], "❌ Critical failure");
      assertEquals(exitCode, 2);
    });

    it("should handle empty error message", () => {
      assertThrows(
        () => utils.error(""),
        Error,
        "Process exited with code 1",
      );
      assertEquals(consoleErrorSpy.length, 1);
      assertEquals(consoleErrorSpy[0], "❌ ");
      assertEquals(exitCode, 1);
    });
  });

  describe("utils.checkApiConnectivity", () => {
    it("should handle basic connectivity test", async () => {
      try {
        // Test API connectivity check - should use default API URL if no env var
        const result = await utils.checkApiConnectivity();

        // Should return a boolean (true if API reachable, false if not)
        assertEquals(typeof result, "boolean");

        // In CI/test environment, API may not be reachable, so both true/false are valid
        // The important thing is that the function doesn't throw and returns a boolean
      } catch (error) {
        // If there's an unexpected error, fail the test
        throw new Error(`checkApiConnectivity should not throw: ${error}`);
      }
    });
  });
});
