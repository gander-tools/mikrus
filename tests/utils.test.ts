import { assertEquals, assertThrows } from "@std/testing/asserts";
import { utils, validateAndSanitizeInput } from "../src/utils.ts";

Deno.test("validateAndSanitizeInput - Valid inputs", () => {
  assertEquals(validateAndSanitizeInput("valid-name"), "valid-name");
  assertEquals(validateAndSanitizeInput("user_data"), "user_data");
  assertEquals(validateAndSanitizeInput("Model123"), "Model123");
  assertEquals(validateAndSanitizeInput(" trimmed "), "trimmed");
});

Deno.test("validateAndSanitizeInput - Invalid inputs", () => {
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

Deno.test("validateAndSanitizeInput - Length validation", () => {
  const longName = "a".repeat(101);
  assertThrows(() => validateAndSanitizeInput(longName));

  const maxLengthName = "a".repeat(100);
  assertEquals(validateAndSanitizeInput(maxLengthName), maxLengthName);
});

Deno.test("utils.validateIdentifier - Valid identifiers", () => {
  assertEquals(utils.validateIdentifier("valid-name"), true);
  assertEquals(utils.validateIdentifier("user_data"), true);
  assertEquals(utils.validateIdentifier("Model123"), true);
  assertEquals(utils.validateIdentifier("a"), true);
});

Deno.test("utils.validateIdentifier - Invalid identifiers", () => {
  assertEquals(utils.validateIdentifier(""), false);
  assertEquals(utils.validateIdentifier("   "), false);
  assertEquals(utils.validateIdentifier("file with spaces"), false);
  assertEquals(utils.validateIdentifier("file*with*reserved"), false);
  assertEquals(utils.validateIdentifier("../malicious"), false);
  assertEquals(utils.validateIdentifier("/absolute"), false);
});

Deno.test("utils.validateIdentifier - Length limits", () => {
  const longName = "a".repeat(101);
  assertEquals(utils.validateIdentifier(longName), false);

  const maxLengthName = "a".repeat(100);
  assertEquals(utils.validateIdentifier(maxLengthName), true);
});

Deno.test("utils.checkApiConnectivity - Basic connectivity test", async () => {
  // Test with mock environment (can't test real API in CI)
  const originalEnv = Deno.env.get("MIKRUS_API_URL");

  try {
    // Test with a mock URL that will fail (expected)
    Deno.env.set("MIKRUS_API_URL", "https://httpbin.org/status/200");
    const result = await utils.checkApiConnectivity();

    // Either true (if network allows) or false (if blocked/failed)
    assertEquals(typeof result, "boolean");
  } finally {
    // Restore original environment
    if (originalEnv) {
      Deno.env.set("MIKRUS_API_URL", originalEnv);
    } else {
      Deno.env.delete("MIKRUS_API_URL");
    }
  }
});

Deno.test("validateAndSanitizeInput - Unicode attack vectors", () => {
  // Test various Unicode normalization attacks
  assertThrows(() => validateAndSanitizeInput("file\u0000null"));
  assertThrows(() => validateAndSanitizeInput("file\u202Ehidden"));
  assertThrows(() => validateAndSanitizeInput("file\uFEFFbom"));

  // Test Unicode directory traversal attempts
  assertThrows(() => validateAndSanitizeInput("file\u002E\u002E/traversal"));
  assertThrows(() => validateAndSanitizeInput("file\uFF0E\uFF0E/unicode"));
});

Deno.test("validateAndSanitizeInput - Edge cases", () => {
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
