# Extension guide for mikrus (Deno + Cliffy)

This document explains how to extend mikrus CLI with additional commands and
functionality using the Deno + Cliffy architecture.

## Architecture Overview

mikrus uses Cliffy Command structure with native Deno APIs. Unlike the
traditional plugin system, extensions are implemented through:

1. **Command Extensions** - Adding new CLI commands
2. **Utility Extensions** - Adding shared functionality to `src/utils.ts`
3. **Type Extensions** - Adding TypeScript type definitions

## Adding New Commands

Commands are defined in the `src/commands/` directory. Each command is a
separate TypeScript file that exports a Cliffy `Command` object.

### Basic Command Structure

```typescript
// src/commands/example.ts
import { Command } from "@cliffy/command";

export const exampleCommand = new Command()
  .description("Example command description")
  .arguments("[name:string]")
  .option("-f, --format <format:string>", "Output format", {
    default: "default",
  })
  .action(async (options, name?: string) => {
    // Command implementation
    console.log(`Hello ${name || "World"}!`);
    console.log(`Format: ${options.format}`);
  });
```

### Registering Commands

Commands are registered in the main CLI file (`src/cli.ts`):

```typescript
// src/cli.ts
import { Command } from "@cliffy/command";
import { generateCommand } from "./commands/generate.ts";
import { exampleCommand } from "./commands/example.ts";

const cli = new Command()
  .name("mikrus")
  .version(`${VERSION} (${GIT_HASH})`)
  .description(
    "Command-line interface tool for managing VPS servers on mikr.us platform",
  )
  .command("generate", generateCommand)
  .command("example", exampleCommand); // Add your command here

await cli.parse(Deno.args);
```

## Adding Utilities

Shared functionality should be added to `src/utils.ts`:

```typescript
// src/utils.ts
export async function validateApiKey(key: string): Promise<boolean> {
  // Validation logic using native Deno fetch
  try {
    const response = await fetch("https://api.mikr.us/validate", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function formatOutput(data: unknown, format: string): string {
  switch (format) {
    case "json":
      return JSON.stringify(data, null, 2);
    case "raw":
      return String(data);
    default:
      return `Formatted: ${JSON.stringify(data)}`;
  }
}
```

## Adding Types

Type definitions should be added to `src/types.ts`:

```typescript
// src/types.ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
}

export interface ServerInfo {
  id: string;
  name: string;
  status: "running" | "stopped" | "maintenance";
  ip: string;
}
```

## Security Considerations

When extending mikrus, follow these security best practices:

1. **Input Validation**: Always validate user input using the existing
   `validateAndSanitizeInput()` function
2. **Path Security**: Use `@std/path` for safe path operations
3. **API Security**: Validate API keys and sanitize API responses
4. **Permissions**: Request minimal Deno permissions (`--allow-read`,
   `--allow-write`, `--allow-net`)

## Testing Extensions

Write tests for your extensions using Deno's native testing framework:

```typescript
// tests/example.test.ts
import { assertEquals } from "@std/testing/asserts";
import { formatOutput } from "../src/utils.ts";

Deno.test("formatOutput should format JSON correctly", () => {
  const data = { name: "test" };
  const result = formatOutput(data, "json");
  assertEquals(result, JSON.stringify(data, null, 2));
});
```

## Building and Distribution

Unlike npm packages, Deno extensions are typically:

1. **URL-based imports** - Import directly from GitHub or JSR
2. **Local modules** - Add to existing project structure
3. **JSR packages** - Publish to JSR registry for reusability

## Migration from Gluegun Plugins

If migrating from Gluegun plugins:

1. **Commands**: Convert `module.exports = { run }` to Cliffy `Command` objects
2. **Extensions**: Move toolbox extensions to `src/utils.ts` functions
3. **Templates**: Use native Deno file APIs instead of Gluegun filesystem
4. **HTTP**: Replace Gluegun HTTP with native `fetch()`

---

**Note**: This architecture is significantly simpler than traditional plugin
systems because Deno provides most functionality natively, eliminating the need
for complex plugin loading mechanisms.
