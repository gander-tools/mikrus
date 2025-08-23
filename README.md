# mikrus CLI

Command-line interface tool for managing VPS servers on mikr.us platform.

## Installation

```shell
bun install
```

## Development

### Building and Running
- `bun run build` - Clean build, compile TypeScript, and copy templates
- `bun run compile` - Compile TypeScript only
- `bun run clean-build` - Clean the build directory

### Code Quality
- `bun run check` - Run Biome linter and formatter checks
- `bun run check:fix` - Run Biome checks and auto-fix issues
- `bun run lint` - Run Biome linter only
- `bun run format` - Format code with Biome

### Testing
- `bun run test` - Run all tests once
- `bun run test:watch` - Run tests in watch mode
- `bun run test:ui` - Run tests with Vitest UI
- `bun run test:coverage` - Run tests with coverage report

## Requirements

- Node.js 20.0.0 or higher
- Bun package manager

# License

MIT - see LICENSE

