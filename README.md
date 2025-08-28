# mikrus CLI (Deno + Cliffy)

[![Deno CI](https://github.com/gander-tools/mikrus/actions/workflows/deno-ci.yml/badge.svg)](https://github.com/gander-tools/mikrus/actions/workflows/deno-ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/gander-tools/mikrus/blob/main/LICENSE)
[![Deno](https://img.shields.io/badge/deno-%5E2.4.0-green.svg)](https://deno.land/)
[![Cliffy](https://img.shields.io/badge/cliffy-v1.0.0--rc.4-orange.svg)](https://github.com/c4spar/deno-cliffy)
[![JSR](https://jsr.io/badges/@gander-tools/mikrus)](https://jsr.io/@gander-tools/mikrus)

Command-line interface tool for managing VPS servers on the **mikr.us**
platform. Built with the modern Deno runtime and Cliffy CLI framework. Inspired by
[mikrus-cli](https://github.com/unkn0w/noobs/blob/main/mikrus-cli/mikrus).

## Installation

### Quick Start (Binary Download)

```shell
# Download pre-compiled binary for your platform
curl -LO https://github.com/gander-tools/mikrus/releases/latest/download/mikrus-linux
chmod +x mikrus-linux
sudo mv mikrus-linux /usr/local/bin/mikrus

# Verify installation
mikrus --version
mikrus --help
```

### Development Installation

```shell
# Clone repository
git clone https://github.com/gander-tools/mikrus.git
cd mikrus

# Run directly with Deno
deno task dev --help

# Or compile your own binary
deno task compile
./build/mikrus --help
```

### Prerequisites

- **Deno**: 2.4.0 or higher
  ([Install Deno](https://deno.land/manual/getting_started/installation))
- **Operating System**: Linux, macOS, or Windows
- **Permissions**: `--allow-read`, `--allow-write`, `--allow-net` for full
  functionality

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

- `deno task dev` - Run CLI directly with Deno
- `deno task compile` - Compile single binary executable
- `deno task compile:all` - Compile for all platforms (Linux, Windows, macOS)

### Code Quality

- `deno task lint` - Run Deno linter
- `deno task fmt` - Format code with Deno formatter
- `deno task fmt:check` - Check code formatting
- `deno task check` - Type check TypeScript files

### Testing

- `deno task test` - Run all tests
- `deno task test:coverage` - Run tests with a coverage report
- `deno task coverage:html` - Generate HTML coverage report

### Binary Compilation

```shell
# Single platform
deno task compile

# All platforms
deno task compile:all

# Custom target
deno compile --allow-read --allow-write --allow-net \
  --target=x86_64-pc-windows-msvc \
  --output=./mikrus-windows.exe \
  src/cli.ts
```

## CI/CD Architecture

This project uses **Deno-native CI/CD pipeline** optimized for modern JavaScript
runtime:

### Core Workflow

- **[Deno CI](./.github/workflows/deno-ci.yml)** - Complete Deno testing and
  deployment pipeline
  - Multi-platform testing (Ubuntu, Windows, macOS)
  - Security auditing and dependency scanning
  - Cross-platform binary compilation
  - Integration testing with compiled binaries

### Workflow Features

- **Native Deno Support**: No Node.js or build steps required
- **Permission-based Security**: Explicit permission management
- **Cross-platform Binaries**: Linux, Windows, macOS compilation
- **Zero Dependencies**: URL-based imports, no node_modules
- **Fast CI**: Native TypeScript execution without a compilation step

## Usage Examples

### Basic Commands

```shell
# Display help and available commands
mikrus --help

# Generate a new component/model/service
mikrus generate <name>

# Check CLI version
mikrus --version
```

### Advanced Usage

```shell
# Generate with alias
mikrus g <name>

# View command-specific help
mikrus generate --help

# Run with explicit permissions
deno run --allow-read --allow-write src/cli.ts generate example
```

## Architecture Overview

### Deno + Cliffy Stack

- **Runtime**: Deno 2.4+ (native TypeScript, secure by default)
- **CLI Framework**: Cliffy 1.0.0-rc.8 (modern, typed CLI commands)
- **Dependencies**: URL-based imports (no package.json dependencies)
- **Testing**: Deno native testing (no external frameworks)
- **Security**: Permission-based access control

### Key Features

- **Zero Configuration**: No build step, no transpilation needed
- **Type Safety**: Native TypeScript support with strict type checking
- **Security First**: Explicit permissions for file system and network access
- **Single Binary**: Compile to standalone executable (~500MB)
- **Cross Platform**: Native support for Linux, macOS, Windows

## Troubleshooting

### Common Issues

**Issue**: `mikrus: command not found`

```shell
# Solution: Ensure binary is in PATH or use full path
export PATH="$PATH:/usr/local/bin"
# Or use full path
/usr/local/bin/mikrus --help
```

**Issue**: Permission errors

```shell
# Solution: Run with explicit permissions
deno run --allow-read --allow-write --allow-net src/cli.ts
```

**Issue**: Deno version compatibility

```shell
# Check your Deno version
deno --version
# Upgrade to Deno 2.4+ if needed
curl -fsSL https://deno.land/x/install/install.sh | sh
```

### Getting Help

- 🔒 **Security**: Review security guidelines in
  [docs/security.md](./docs/security.md)
- 🐛 **Issues**: Report bugs at
  [GitHub Issues](https://github.com/gander-tools/mikrus/issues)
- 💬 **Discussions**: Join conversations in
  [GitHub Discussions](https://github.com/gander-tools/mikrus/discussions)

## 📚 Project Documentation

### Core Documentation

- 📋 **[Commands Reference](./docs/commands.md)** - Complete CLI command
  documentation
- 🔒 **[Security Guidelines](./docs/security.md)** - Security best practices and
  compliance

### Project Policies

- 📜 **[Security Policy](./SECURITY.md)** - Vulnerability reporting and security
  procedures
- 🚀 **[Publishing Guide](./PUBLISHING.md)** - Release and deployment procedures
- ⚖️ **[License](./LICENSE)** - MIT License terms and conditions

### Repository Health

- 🛡️ **Security Status**: Permission-based security model, daily automated scans
- 🧪 **Test Coverage**: 100% with 30 comprehensive security tests
- 🔄 **CI/CD Pipeline**: Deno-native testing and cross-platform compilation

---

**Last Updated**: 2025-08-26\
**License**: [MIT](./LICENSE)\
**Runtime**: Deno 2.4+\
**Framework**: Cliffy 1.0.0-rc.8
