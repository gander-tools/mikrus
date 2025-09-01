import { assertEquals } from "jsr:@std/assert@1.0.8";
import { describe, it } from "jsr:@std/testing@1.0.8/bdd";
import { GIT_HASH, VERSION } from "../src/version.ts";

describe("Version Module", () => {
  describe("VERSION constant", () => {
    it("should be a placeholder string", () => {
      assertEquals(typeof VERSION, "string");
      assertEquals(VERSION, "%VERSION%");
    });
  });

  describe("GIT_HASH constant", () => {
    it("should be a placeholder string", () => {
      assertEquals(typeof GIT_HASH, "string");
      assertEquals(GIT_HASH, "%GIT_HASH%");
    });
  });
});
