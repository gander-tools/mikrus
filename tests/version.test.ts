import { assertEquals } from "@std/testing/asserts";
import { GIT_HASH, VERSION } from "../src/version.ts";

Deno.test("VERSION - Type and content validation", () => {
  // VERSION should always be a string
  assertEquals(typeof VERSION, "string");
  assertEquals(VERSION.length > 0, true);
  
  // Should be either placeholder or actual version
  const isPlaceholder = VERSION === "%VERSION%";
  const isActualVersion = !VERSION.includes("%") && VERSION.length > 0;
  assertEquals(isPlaceholder || isActualVersion, true);
});

Deno.test("GIT_HASH - Type and content validation", () => {
  // GIT_HASH should always be a string
  assertEquals(typeof GIT_HASH, "string");
  assertEquals(GIT_HASH.length > 0, true);
  
  // Should be either placeholder or actual hash
  const isPlaceholder = GIT_HASH === "%GIT_HASH%";
  const isActualHash = !GIT_HASH.includes("%") && GIT_HASH.length > 0;
  assertEquals(isPlaceholder || isActualHash, true);
});

Deno.test("VERSION - Type validation", () => {
  assertEquals(typeof VERSION, "string");
  assertEquals(VERSION.length > 0, true);
});

Deno.test("GIT_HASH - Type validation", () => {
  assertEquals(typeof GIT_HASH, "string");
  assertEquals(GIT_HASH.length > 0, true);
});
