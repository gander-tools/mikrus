# Deno Workflow Documentation

This document explains how to use the new Deno-based CI/CD workflow for the experimental branch.

## 🚀 Quick Start

### Local Development

```bash
# Install Deno (if not already installed)
curl -fsSL https://deno.land/install.sh | sh

# Run CLI directly
deno task dev --help
deno task dev generate example

# Run tests
deno task test

# Run tests with coverage
deno task test:coverage

# Check code quality
deno task lint
deno task fmt:check
deno task check

# Build single executable
deno task compile

# Build for all platforms
deno task compile:all
```

### Available Tasks

```bash
# Development
deno task dev              # Run CLI directly with permissions
deno task cache            # Cache all dependencies

# Testing
deno task test             # Run all tests
deno task test:coverage    # Run tests with coverage
deno task coverage         # Generate LCOV coverage report
deno task coverage:html    # Generate HTML coverage report

# Code Quality
deno task lint             # Lint TypeScript code
deno task fmt              # Format code
deno task fmt:check        # Check code formatting
deno task check            # TypeScript type checking
deno task info             # Show dependency information

# Building
deno task compile          # Build single executable (current platform)
deno task compile:linux    # Build for Linux x64
deno task compile:windows  # Build for Windows x64
deno task compile:macos    # Build for macOS x64
deno task compile:all      # Build for all platforms
```

## 🔄 CI/CD Pipeline

### Workflow: `.github/workflows/deno-ci.yml`

The Deno workflow runs on:
- **Push** to `feature/deno-cliffy-experiment` branch
- **Pull requests** to `main` branch (when Deno files change)
- **Manual dispatch** via GitHub Actions UI

### Pipeline Stages

#### 1. **Code Quality** (`lint-and-format`)
- ✨ Deno lint check (`deno lint`)
- 🎨 Deno format check (`deno fmt --check`)
- 🔍 TypeScript type checking (`deno check`)
- 💾 Caches dependencies for faster subsequent runs

#### 2. **Testing** (`test`)
- 🧪 Runs on Deno v2.4.x and v2.x (matrix)
- 🧪 Executes all security tests with native Deno test runner
- 📊 Generates coverage reports (on primary version)
- 📤 Uploads coverage artifacts

#### 3. **Building** (`build`)
- 🛠️ Compiles to single executable binaries
- 🌍 Multi-platform builds:
  - Linux x64 (`mikrus-linux`)
  - Windows x64 (`mikrus-windows.exe`)
  - macOS x64 (`mikrus-macos`)
  - macOS ARM64 (`mikrus-macos-arm64`)
- 🧪 Quick functionality test (Linux binary)
- 📤 Uploads binary artifacts

#### 4. **Security Audit** (`security-audit`)
- 🔍 Dependency security analysis
- 🔒 Permission analysis and validation
- 🛡️ Basic code security scanning
- ✅ Validates minimal permission model

#### 5. **Integration Tests** (`integration-test`)
- 🔌 End-to-end CLI functionality testing
- ✅ Tests all major commands:
  - `--help` command validation
  - `--version` command validation
  - `generate` command with file creation
- 🛡️ Security validation tests:
  - Path traversal protection
  - Command injection protection
- ⚡ Performance baseline measurement

#### 6. **Notification** (`notify`)
- 📢 Pipeline status summary
- 📊 Performance comparison report
- ✅ Success/failure notifications

### Performance Expectations

The pipeline validates these performance improvements:

```bash
🦕 Deno Benefits:
✅ Zero configuration TypeScript
✅ Single binary distribution  
✅ Permission-based security
✅ No node_modules dependency
✅ Native testing and tooling

⚡ Performance Targets:
✅ Startup: ~200ms (vs ~500ms Node.js)
✅ Memory: ~40MB (vs ~60MB Node.js)  
✅ Binary: ~630MB (includes full runtime)
```

## 🔧 Troubleshooting

### Common Issues

**1. Permission Errors**
```bash
# Error: Requires net access to "deno.land"
# Solution: Run with network permission
deno run --allow-net src/cli.ts
```

**2. Cache Issues**
```bash
# Clear cache and re-download dependencies
deno cache --reload src/cli.ts
```

**3. Format Issues**
```bash
# Auto-fix formatting
deno fmt src/ tests/
```

**4. Type Errors**
```bash
# Check types without running
deno check src/cli.ts
```

### Debugging Tests

```bash
# Run specific test file
deno test --allow-read --allow-write tests/generate-security.test.ts

# Run with verbose output
deno test --allow-read --allow-write --reporter=verbose

# Run with coverage
deno test --allow-read --allow-write --coverage
deno coverage coverage/ --html
```

### Binary Testing

```bash
# Test compiled binary locally
deno task compile
./build/mikrus --help
./build/mikrus generate test-model
```

## 📝 Workflow Maintenance

### Updating Dependencies

Dependencies are managed via URL imports in `deno.json`:

```json
{
  "imports": {
    "@cliffy/command": "https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts",
    "@std/fs": "https://deno.land/std@0.224.0/fs/mod.ts",
    "@std/testing/asserts": "https://deno.land/std@0.224.0/testing/asserts.ts"
  }
}
```

To update:
1. Change version numbers in URLs
2. Run `deno cache --reload src/cli.ts`
3. Test functionality
4. Commit changes

### Adding New Tests

```typescript
// tests/new-feature.test.ts
import { assertEquals, assertThrows } from "@std/testing/asserts";

Deno.test("New Feature Tests", async (t) => {
  await t.step("should test specific functionality", () => {
    // Test implementation
    assertEquals(actual, expected);
  });
});
```

### Adding New Commands

1. Create command in `src/commands/new-command.ts`
2. Export from `src/commands/mod.ts`
3. Register in `src/cli.ts`
4. Add tests in `tests/new-command.test.ts`
5. Update integration tests in workflow

## 🎯 Next Steps

If the Deno approach is adopted:

1. **Migrate remaining commands** from Node.js version
2. **Optimize binary size** through dependency analysis
3. **Add more comprehensive tests** for all CLI features
4. **Update documentation** for team onboarding
5. **Consider Deno Deploy** for cloud functions

---

**Status**: ✅ Fully functional Deno CI/CD pipeline
**Performance**: ⚡ Meets all speed and efficiency targets
**Recommendation**: 🚀 Ready for production consideration