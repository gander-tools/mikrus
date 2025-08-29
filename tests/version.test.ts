import { assertEquals } from "@std/testing/asserts";
import { GIT_HASH, VERSION } from "../src/version.ts";

Deno.test("VERSION - Type and content validation", () => {
  // VERSION should always be a string
  assertEquals(typeof VERSION, "string");
  assertEquals(VERSION.length > 0, true);
  
  // Should be valid version (either "dev" for development or semantic version for production)
  const versionString = VERSION as string;
  const isDevelopment = versionString === "dev";
  const isProduction = versionString !== "dev" && !versionString.includes("%");
  assertEquals(isDevelopment || isProduction, true);
});

Deno.test("GIT_HASH - Type and content validation", () => {
  // GIT_HASH should always be a string
  assertEquals(typeof GIT_HASH, "string");
  assertEquals(GIT_HASH.length > 0, true);
  
  // Should be valid hash (either "local" for development or actual hash for production)
  const hashString = GIT_HASH as string;
  const isDevelopment = hashString === "local";
  const isProduction = hashString !== "local" && !hashString.includes("%");
  assertEquals(isDevelopment || isProduction, true);
});

Deno.test("VERSION - Type validation", () => {
  assertEquals(typeof VERSION, "string");
  assertEquals(VERSION.length > 0, true);
});

Deno.test("GIT_HASH - Type validation", () => {
  assertEquals(typeof GIT_HASH, "string");
  assertEquals(GIT_HASH.length > 0, true);
});
