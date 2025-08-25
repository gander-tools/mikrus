# mikrus CLI

[![CI/CD Pipeline](https://github.com/gander-tools/mikrus/actions/workflows/ci.yml/badge.svg)](https://github.com/gander-tools/mikrus/actions/workflows/ci.yml)
[![Security Audit](https://github.com/gander-tools/mikrus/actions/workflows/comprehensive-security-audit.yml/badge.svg)](https://github.com/gander-tools/mikrus/actions/workflows/comprehensive-security-audit.yml)
[![NPM Version](https://img.shields.io/npm/v/mikrus.svg)](https://www.npmjs.com/package/mikrus)
[![NPM Downloads](https://img.shields.io/npm/dm/mikrus.svg)](https://www.npmjs.com/package/mikrus)
[![License](https://img.shields.io/npm/l/mikrus.svg)](https://github.com/gander-tools/mikrus/blob/main/LICENSE)

Command-line interface tool for managing VPS servers on the **mikr.us** platform. Inspired by [mikrus-cli](https://github.com/unkn0w/noobs/blob/main/mikrus-cli/mikrus).

## Installation

### Quick Start (User Installation)

```shell
# Install globally using npm
npm install -g mikrus

# Or using bun
bun install -g mikrus

# Verify installation
mikrus --version
mikrus --help
```

### Development Installation

```shell
# Clone repository
git clone https://github.com/gander-tools/mikrus.git
cd mikrus

# Install dependencies
bun install --frozen-lockfile

# Build the project
bun run build

# Test the CLI locally
./bin/mikrus --help
```

### Prerequisites

- **Node.js**: 20.0.0 or higher (LTS recommended)
- **Package Manager**: Bun (recommended) or npm
- **Operating System**: Linux, macOS, or Windows

### Verification

After installation, verify everything is working:

```shell
# Check version
mikrus --version

# View available commands
mikrus --help

# Test command help (example)
mikrus generate --help
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
1. **[CI Pipeline](./.github/workflows/ci.yml)** - Main validation workflow
   - Triggers: Push/PR to main/develop branches
   - Includes: Lint, test, build, security scan, integration tests
   
2. **[Security Audit](./.github/workflows/comprehensive-security-audit.yml)** - Comprehensive security analysis
   - Triggers: Daily schedule (2:00 UTC) + called by CI Pipeline
   - Includes: Dependency scan, license compliance, secrets detection, supply chain security, Snyk vulnerability scanning

3. **[Release](./.github/workflows/release.yml)** - Automated release and publishing
   - Triggers: Git tags matching `v*.*.*`
   - Includes: GitHub Release creation, NPM publishing with provenance

4. **[Dependabot Auto-merge](./.github/workflows/dependabot-auto-merge.yml)** - Dependency automation
   - Triggers: Dependabot PRs
   - Includes: Automatic merging of minor/patch updates after CI success

### Workflow Features
- **GitHub Native Integration**: Uses GitHub's native branch auto-deletion instead of custom workflows
- **Resource Optimization**: Minimal workflow count reduces GitHub Actions minutes consumption
- **Security-First**: All releases require successful CI and security validation
- **Provenance**: NPM packages published with cryptographic provenance for supply chain security

## Usage Examples

### Basic Commands

```shell
# Display help and available commands
mikrus --help

# Generate a new component/model/service
mikrus generate <type> <name>

# Check CLI version
mikrus --version
```

### Advanced Usage

```shell
# Generate with specific options
mikrus generate model User --with-validation

# View command-specific help
mikrus generate --help
```

## Troubleshooting

### Common Issues

**Issue**: `mikrus: command not found`
```shell
# Solution: Ensure global installation
npm install -g mikrus
# Or add local bin to PATH
export PATH="$PATH:./node_modules/.bin"
```

**Issue**: Permission errors on Unix systems
```shell
# Solution: Fix binary permissions
chmod +x ./bin/mikrus
```

**Issue**: Node.js version compatibility
```shell
# Check your Node.js version
node --version
# Upgrade to Node.js 20+ if needed
nvm install 20 && nvm use 20
```

### Getting Help

- 📚 **Documentation**: See [docs/commands.md](./docs/commands.md) for detailed command reference
- 🔌 **Plugin System**: Learn about plugins in [docs/plugins.md](./docs/plugins.md)
- 🔒 **Security**: Review security guidelines in [docs/security.md](./docs/security.md)
- 🐛 **Issues**: Report bugs at [GitHub Issues](https://github.com/gander-tools/mikrus/issues)
- 💬 **Discussions**: Join conversations in [GitHub Discussions](https://github.com/gander-tools/mikrus/discussions)

## 📚 Project Documentation

### Core Documentation
- 📋 **[Commands Reference](./docs/commands.md)** - Complete CLI command documentation
- 🔌 **[Plugin System](./docs/plugins.md)** - Plugin development and usage guide
- 🔒 **[Security Guidelines](./docs/security.md)** - Security best practices and compliance

### Project Policies
- 📜 **[Security Policy](./SECURITY.md)** - Vulnerability reporting and security procedures
- 🚀 **[Publishing Guide](./PUBLISHING.md)** - Release and deployment procedures
- ⚖️ **[License](./LICENSE)** - MIT License terms and conditions

### Repository Health
- 🛡️ **Security Status**: 0 open vulnerabilities, daily automated scans
- 🧪 **Test Coverage**: 78.23% with 31 comprehensive tests
- 🔄 **CI/CD Pipeline**: 6 required status checks, automated quality gates

---

**Last Updated**: 2025-08-25  
**License**: [MIT](./LICENSE)

