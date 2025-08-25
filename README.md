# mikrus CLI

[![CI/CD Pipeline](https://github.com/gander-tools/mikrus/actions/workflows/ci.yml/badge.svg)](https://github.com/gander-tools/mikrus/actions/workflows/ci.yml)
[![Security Scan](https://github.com/gander-tools/mikrus/actions/workflows/security-scan.yml/badge.svg)](https://github.com/gander-tools/mikrus/actions/workflows/security-scan.yml)
[![NPM Version](https://img.shields.io/npm/v/mikrus.svg)](https://www.npmjs.com/package/mikrus)
[![NPM Downloads](https://img.shields.io/npm/dm/mikrus.svg)](https://www.npmjs.com/package/mikrus)
[![License](https://img.shields.io/npm/l/mikrus.svg)](https://github.com/gander-tools/mikrus/blob/main/LICENSE)

Command-line interface tool for managing VPS servers on the mikr.us platform.

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
- `bun run test:coverage` - Run tests with a coverage report

## CI/CD Architecture

This project uses a **minimal 4-workflow architecture** optimized for efficiency and reliability:

### Core Workflows
1. **CI Pipeline** (`ci.yml`) - Main validation workflow
   - Triggers: Push/PR to main/develop branches
   - Includes: Lint, test, build, security scan, integration tests
   
2. **Security Scan** (`security-scan.yml`) - Comprehensive security analysis
   - Triggers: Daily schedule (2:00 UTC) + called by CI Pipeline
   - Includes: Dependency scan, license compliance, secrets detection, supply chain security

3. **Release** (`release.yml`) - Automated release and publishing
   - Triggers: Git tags matching `v*.*.*`
   - Includes: GitHub Release creation, NPM publishing with provenance

4. **Dependabot Auto-merge** (`dependabot-auto-merge.yml`) - Dependency automation
   - Triggers: Dependabot PRs
   - Includes: Automatic merging of minor/patch updates after CI success

### Workflow Features
- **GitHub Native Integration**: Uses GitHub's native branch auto-deletion instead of custom workflows
- **Resource Optimization**: Minimal workflow count reduces GitHub Actions minutes consumption
- **Security-First**: All releases require successful CI and security validation
- **Provenance**: NPM packages published with cryptographic provenance for supply chain security

## Requirements

- Node.js 20.0.0 or higher
- Bun package manager

# License

MIT - see LICENSE

