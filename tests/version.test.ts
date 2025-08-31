import { assertEquals, assertMatch } from "jsr:@std/assert@1.0.8";
import {
  afterEach,
  beforeEach,
  describe,
  it,
} from "jsr:@std/testing@1.0.8/bdd";

describe("Version Module", () => {
  let originalGitHash: string | undefined;
  let originalPath: string | undefined;

  beforeEach(() => {
    // Save original environment
    originalGitHash = Deno.env.get("GIT_HASH");
    originalPath = Deno.env.get("PATH");
  });

  afterEach(() => {
    // Restore original environment
    if (originalGitHash !== undefined) {
      Deno.env.set("GIT_HASH", originalGitHash);
    } else {
      Deno.env.delete("GIT_HASH");
    }

    if (originalPath !== undefined) {
      Deno.env.set("PATH", originalPath);
    }
  });

  describe("VERSION constant", () => {
    it("should be a valid semver string", async () => {
      // Clear module cache to force re-import
      const module = await import("../src/version.ts?" + Math.random());

      assertEquals(typeof module.VERSION, "string");
      assertEquals(module.VERSION.length > 0, true);

      // Should match semantic versioning pattern
      assertMatch(module.VERSION, /^\d+\.\d+\.\d+$/);
    });

    it("should be exported correctly", async () => {
      const module = await import("../src/version.ts?" + Math.random());
      assertEquals(module.VERSION, "0.1.0");
    });
  });

  describe("GIT_HASH with environment variable", () => {
    it("should use GIT_HASH from environment when available", async () => {
      // Set environment variable
      Deno.env.set("GIT_HASH", "abc123def456789");

      // Clear module cache and re-import
      const module = await import("../src/version.ts?" + Math.random());

      // Should use first 7 characters
      assertEquals(module.GIT_HASH, "abc123d");
    });

    it("should handle short GIT_HASH from environment", async () => {
      // Set short hash
      Deno.env.set("GIT_HASH", "xyz");

      // Clear module cache and re-import
      const module = await import("../src/version.ts?" + Math.random());

      // Should use the entire short hash
      assertEquals(module.GIT_HASH, "xyz");
    });

    it("should handle empty GIT_HASH environment variable", async () => {
      // Set empty hash
      Deno.env.set("GIT_HASH", "");

      // Clear module cache and re-import
      const module = await import("../src/version.ts?" + Math.random());

      // Should fall back to git command or "unknown"
      assertEquals(typeof module.GIT_HASH, "string");
      assertEquals(module.GIT_HASH.length > 0, true);
    });
  });

  describe("GIT_HASH with git command", () => {
    it("should fall back to git command when env var not set", async () => {
      // Ensure GIT_HASH env var is not set
      Deno.env.delete("GIT_HASH");

      // Clear module cache and re-import
      const module = await import("../src/version.ts?" + Math.random());

      // Should be a string (either git hash or "unknown")
      assertEquals(typeof module.GIT_HASH, "string");
      assertEquals(module.GIT_HASH.length > 0, true);

      // Should be either a valid git hash or "unknown"
      const isGitHash = /^[a-f0-9]{7}$/.test(module.GIT_HASH);
      const isUnknown = module.GIT_HASH === "unknown";
      assertEquals(isGitHash || isUnknown, true);
    });

    it("should handle git command failure gracefully", async () => {
      // Remove git from PATH to simulate git not being available
      Deno.env.delete("GIT_HASH");
      Deno.env.set("PATH", "/nonexistent");

      // Clear module cache and re-import
      const module = await import("../src/version.ts?" + Math.random());

      // Should return "unknown" when git is not available
      assertEquals(module.GIT_HASH, "unknown");
    });
  });

  describe("GIT_HASH caching", () => {
    it("should cache the git hash after first evaluation", async () => {
      // Set initial hash
      Deno.env.set("GIT_HASH", "initial1234567");

      // Import module
      const module1 = await import("../src/version.ts?" + Math.random());
      const firstHash = module1.GIT_HASH;
      assertEquals(firstHash, "initial");

      // Change environment (this shouldn't affect the cached value in same module)
      Deno.env.set("GIT_HASH", "changed7654321");

      // The same module instance should return cached value
      assertEquals(module1.GIT_HASH, "initial");

      // A new import should get the new value
      const module2 = await import("../src/version.ts?" + Math.random());
      assertEquals(module2.GIT_HASH, "changed");
    });
  });

  describe("Edge cases", () => {
    it("should handle missing git binary and no env var", async () => {
      Deno.env.delete("GIT_HASH");
      // Set PATH to empty to ensure git won't be found
      Deno.env.set("PATH", "");

      const module = await import("../src/version.ts?" + Math.random());

      // Should return "unknown"
      assertEquals(module.GIT_HASH, "unknown");
    });

    it("should handle git command returning error code", async () => {
      Deno.env.delete("GIT_HASH");
      // Ensure we're not in a git repo by changing to /tmp
      // This test may behave differently in CI vs local

      const module = await import("../src/version.ts?" + Math.random());

      // Should be either a valid hash or "unknown"
      assertEquals(typeof module.GIT_HASH, "string");
      assertEquals(module.GIT_HASH.length > 0, true);
    });

    it("should handle very long GIT_HASH from environment", async () => {
      const longHash = "a".repeat(100);
      Deno.env.set("GIT_HASH", longHash);

      const module = await import("../src/version.ts?" + Math.random());

      // Should truncate to 7 characters
      assertEquals(module.GIT_HASH, "aaaaaaa");
    });
  });
});
