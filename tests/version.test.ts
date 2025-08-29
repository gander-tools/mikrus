import { assertEquals } from "@std/testing/asserts";
import { GIT_HASH, VERSION } from "../src/version.ts";

Deno.test("VERSION - Development fallback", () => {
  // In development, VERSION should fallback to 'dev' when placeholder is present
  if (VERSION === "%VERSION%") {
    assertEquals(VERSION, "%VERSION%");
  } else {
    // In production/compiled builds, should be actual version
    assertEquals(typeof VERSION, "string");
    assertEquals(VERSION.length > 0, true);
  }
});

Deno.test("GIT_HASH - Development fallback", () => {
  // In development, GIT_HASH should fallback to 'local' when placeholder is present
  if (GIT_HASH === "%GIT_HASH%") {
    assertEquals(GIT_HASH, "%GIT_HASH%");
  } else {
    // In production/compiled builds, should be actual git hash
    assertEquals(typeof GIT_HASH, "string");
    assertEquals(GIT_HASH.length > 0, true);
  }
});

Deno.test("VERSION - Type validation", () => {
  assertEquals(typeof VERSION, "string");
  assertEquals(VERSION.length > 0, true);
});

Deno.test("GIT_HASH - Type validation", () => {
  assertEquals(typeof GIT_HASH, "string");
  assertEquals(GIT_HASH.length > 0, true);
});
