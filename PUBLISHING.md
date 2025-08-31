# Publishing Guide (Deno + JSR)

This document describes the publishing setup for the `mikrus` CLI package using
Deno and JSR (JavaScript Registry).

## Package Information

- **Author**: Adam Gąsowski (GitHub: @gander)
- **Organization**: Gander Tools (GitHub: @gander-tools)
- **Package name**: `@gander-tools/mikrus` (JSR scoped package)
- **Runtime**: Deno 2.0+
- **CLI Framework**: Cliffy
- **Repository**: https://github.com/gander-tools/mikrus

## Distribution Strategy

mikrus uses a **dual distribution approach**:

1. **Pre-compiled Binaries** - Single executable files (~500MB)
2. **JSR Package** - Source code for developers (future)

### Binary Distribution

Pre-compiled binaries are built and distributed through GitHub Releases:

- **Platforms**: Linux (x86_64), Windows (x86_64), macOS (x86_64, ARM64)
- **CI/CD**: Automated compilation via GitHub Actions
- **Download**: Direct binary download from GitHub Releases

### JSR Publishing (Future)

JSR (JavaScript Registry) is the modern package registry for Deno:

- **Registry**: https://jsr.io/
- **Package name**: `@gander-tools/mikrus`
- **Scope**: `@gander-tools`
- **Access**: public

## Current Release Process (GitHub Binaries)

### Automated Release

The release process is currently automated through GitHub Actions:

1. **Tag Creation**: Create a git tag with semantic versioning
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Automated Build**: CI/CD pipeline automatically:
   - Compiles binaries for all platforms
   - Creates GitHub Release
   - Uploads binary assets

3. **Download**: Users can download binaries from GitHub Releases

### Manual Binary Compilation

For local testing or custom builds:

```bash
# Compile for current platform
deno task compile

# Compile for specific platform
deno compile --allow-read --allow-write --allow-net \
  --target=x86_64-pc-windows-msvc \
  --output=./mikrus-windows.exe \
  src/cli.ts

# Compile for all platforms  
deno task compile:all
```

## Future JSR Publishing Setup

When ready for JSR publishing, follow these steps:

### 1. JSR Configuration

Note: Currently no `jsr.json` file exists. When ready for JSR publishing, create
one with:

```json
{
  "name": "@gander-tools/mikrus",
  "version": "0.0.1",
  "description": "Command-line interface tool for managing VPS servers on mikr.us platform",
  "license": "MIT",
  "exports": {
    ".": "./src/cli.ts"
  },
  "exclude": [
    "tests/",
    "build/",
    "coverage/",
    ".github/"
  ]
}
```

### 2. JSR Authentication

Set up JSR publishing credentials:

```bash
# Generate JSR token (when available)
deno publish --token=<JSR_TOKEN>
```

### 3. Publication Command

Publish to JSR registry:

```bash
# Validate package
deno publish --dry-run

# Publish to JSR
deno publish
```

## Version Management

### Semantic Versioning

mikrus follows semantic versioning (SemVer):

- **MAJOR** (1.0.0): Breaking changes to CLI interface
- **MINOR** (0.1.0): New commands or significant features
- **PATCH** (0.0.1): Bug fixes and minor improvements

### Version Update Process

1. **Update Version**: Update version in `jsr.json` and `deno.json`
2. **Create Tag**: Create git tag matching the version
3. **Automated Release**: CI/CD handles the rest

## Security and Provenance

### Binary Security

- **Compilation**: Reproducible builds through GitHub Actions
- **Signing**: Future implementation of binary signing
- **Checksum**: SHA256 checksums provided with releases

### JSR Security (Future)

- **Provenance**: JSR provides automatic provenance for published packages
- **Integrity**: Content verification through JSR registry
- **Supply Chain**: JSR tracks dependency chains

## Installation Methods

### Binary Installation (Current)

```bash
# Download and install binary (Linux)
curl -LO https://github.com/gander-tools/mikrus/releases/latest/download/mikrus-linux
chmod +x mikrus-linux
sudo mv mikrus-linux /usr/local/bin/mikrus

# Verify installation
mikrus --version
```

### Deno Installation (Current)

```bash
# Run directly from source
deno run --allow-read --allow-write --allow-net \
  https://raw.githubusercontent.com/gander-tools/mikrus/main/src/cli.ts

# Clone and run locally
git clone https://github.com/gander-tools/mikrus.git
cd mikrus
deno task dev
```

### JSR Installation (Future)

```bash
# Install from JSR (when available)
deno install --allow-read --allow-write --allow-net \
  --name mikrus jsr:@gander-tools/mikrus

# Import in code (when available)
import { mikrusCommand } from "jsr:@gander-tools/mikrus";
```

## Migration Notes

### From npm to JSR

Key differences from npm publishing:

- **No build step**: Deno runs TypeScript natively
- **No dependencies**: URL-based imports, no package.json dependencies
- **Permissions**: Explicit permission system
- **Registry**: JSR instead of npm for better Deno integration

### Legacy npm Support

npm package is **deprecated** in favor of:

1. Pre-compiled binaries (primary distribution)
2. JSR package (future developer distribution)
3. Direct Deno execution (development)

---

**Migration Status**: ✅ Binary distribution ready | 🚧 JSR publishing in
development **Current Recommendation**: Use pre-compiled binaries for
production, Deno source for development
