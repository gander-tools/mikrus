import { assertEquals, assertThrows } from "@std/testing/asserts";
import { utils, validateAndSanitizeInput } from "../src/utils.ts";

Deno.test("Generate Command Security Tests", async (t) => {
  await t.step("Input Validation Edge Cases", async (t) => {
    await t.step("should reject empty string input", () => {
      assertThrows(
        () => validateAndSanitizeInput("   "), // Only whitespace
        Error,
        "Name parameter cannot be empty",
      );
    });

    await t.step("should reject null input", () => {
      assertThrows(
        // deno-lint-ignore no-explicit-any
        () => validateAndSanitizeInput(null as any),
        Error,
        "Name parameter is required and must be a string",
      );
    });

    await t.step("should reject non-string input", () => {
      assertThrows(
        // deno-lint-ignore no-explicit-any
        () => validateAndSanitizeInput(123 as any),
        Error,
        "Name parameter is required and must be a string",
      );
    });
  });

  await t.step("Path Traversal Protection", async (t) => {
    await t.step("should reject path traversal with ../", () => {
      assertThrows(
        () => validateAndSanitizeInput("../malicious-file"),
        Error,
        "Path traversal detected",
      );
    });

    await t.step("should reject path traversal with ..\\", () => {
      assertThrows(
        () => validateAndSanitizeInput("..\\malicious-file"),
        Error,
        "Path traversal detected",
      );
    });

    await t.step("should reject embedded .. sequences", () => {
      assertThrows(
        () => validateAndSanitizeInput("some..sequence"),
        Error,
        "Path traversal detected",
      );
    });
  });

  await t.step("Absolute Path Protection", async (t) => {
    await t.step("should reject Unix absolute paths", () => {
      assertThrows(
        () => validateAndSanitizeInput("/etc/passwd"),
        Error,
        "Absolute paths are not allowed",
      );
    });

    await t.step("should reject Windows absolute paths", () => {
      assertThrows(
        () => validateAndSanitizeInput("C:\\Windows\\System32\\evil.exe"),
        Error,
        "Absolute paths are not allowed",
      );
    });

    await t.step("should reject backslash paths", () => {
      assertThrows(
        () => validateAndSanitizeInput("\\malicious\\path"),
        Error,
        "Absolute paths are not allowed",
      );
    });
  });

  await t.step("Command Injection Protection", async (t) => {
    await t.step("should reject shell metacharacters", () => {
      const dangerousInputs = [
        "file; rm -rf /",
        "file | cat /etc/passwd",
        "file && evil-command",
        "file$(malicious)",
        "file`malicious`",
        "file<script>",
        "file'injection",
        'file"injection',
        "file\\injection",
      ];

      for (const input of dangerousInputs) {
        assertThrows(
          () => validateAndSanitizeInput(input),
          Error,
          "Invalid characters detected",
        );
      }
    });
  });

  await t.step("File System Reserved Characters", async (t) => {
    await t.step("should reject reserved filesystem characters", () => {
      // These characters are caught by command injection protection first
      const shellMetaChars = [
        "file<name",
        "file>name",
        'file"name',
        "file|name",
      ];

      for (const input of shellMetaChars) {
        assertThrows(
          () => validateAndSanitizeInput(input),
          Error,
          "Invalid characters detected",
        );
      }

      // These characters are specifically reserved filesystem chars
      const fsReservedChars = [
        "file:name",
        "file/name",
        "file?name",
        "file*name",
      ];

      for (const input of fsReservedChars) {
        assertThrows(
          () => validateAndSanitizeInput(input),
          Error,
          "reserved file system characters",
        );
      }
    });
  });

  await t.step("Length Validation", async (t) => {
    await t.step("should reject extremely long input", () => {
      const longInput = "a".repeat(101); // Exceeds 100 char limit
      assertThrows(
        () => validateAndSanitizeInput(longInput),
        Error,
        "Name parameter is too long",
      );
    });

    await t.step("should accept input at maximum length", () => {
      const maxInput = "a".repeat(100); // Exactly 100 chars
      const result = validateAndSanitizeInput(maxInput);
      assertEquals(result, maxInput);
    });
  });

  await t.step("Valid Pattern Enforcement", async (t) => {
    await t.step("should reject invalid characters in filename", () => {
      const invalidInputs = [
        "file with spaces",
        "file@symbol",
        "file#hash",
        "file%percent",
        "file(parentheses)",
        "file[brackets]",
        "file{braces}",
        "file+plus",
      ];

      for (const input of invalidInputs) {
        assertThrows(
          () => validateAndSanitizeInput(input),
          Error,
          "must contain only letters, numbers, hyphens, and underscores",
        );
      }
    });

    await t.step("should accept valid filename patterns", () => {
      const validInputs = [
        "simple-file",
        "file_with_underscores",
        "CamelCaseFile",
        "file123",
        "a",
        "FILE-NAME-123_TEST",
      ];

      for (const input of validInputs) {
        const result = validateAndSanitizeInput(input);
        assertEquals(result, input);
      }
    });
  });

  await t.step("Whitespace Handling", async (t) => {
    await t.step("should trim whitespace from input", () => {
      const result = validateAndSanitizeInput("  valid-name  ");
      assertEquals(result, "valid-name");
    });
  });
});

Deno.test("Utility Functions", async (t) => {
  await t.step("validateIdentifier", async (t) => {
    await t.step("should return true for valid identifiers", () => {
      assertEquals(utils.validateIdentifier("valid-name"), true);
      assertEquals(utils.validateIdentifier("file_123"), true);
      assertEquals(utils.validateIdentifier("CamelCase"), true);
    });

    await t.step("should return false for invalid identifiers", () => {
      assertEquals(utils.validateIdentifier(""), false);
      assertEquals(utils.validateIdentifier("file with spaces"), false);
      assertEquals(utils.validateIdentifier("file@invalid"), false);
    });

    await t.step("should return false for non-string input", () => {
      // deno-lint-ignore no-explicit-any
      assertEquals(utils.validateIdentifier(null as any), false);
      // deno-lint-ignore no-explicit-any
      assertEquals(utils.validateIdentifier(123 as any), false);
    });
  });

  await t.step("API connectivity check", async (t) => {
    await t.step("should handle network failures gracefully", async () => {
      // This test will fail in real environments but demonstrates the structure
      const result = await utils.checkApiConnectivity();
      // Just test that it returns a boolean without throwing
      assertEquals(typeof result, "boolean");
    });
  });
});
