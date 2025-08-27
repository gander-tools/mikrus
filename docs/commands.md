# Command Reference for mikrus

Command-line interface tool for managing VPS servers on the mikr.us platform.

## Available Commands

### `mikrus`

Main command that displays welcome information.

**Usage:**

```bash
mikrus
```

**Output:**

```
Welcome to your CLI
```

---

### `mikrus generate <name>` (alias: `g`)

Generates model files from templates with comprehensive security validation.

**Usage:**

```bash
mikrus generate <model-name>
mikrus g <model-name>
```

**Parameters:**

- `<model-name>` - Name for the generated model (required)

**Security Validations:**

- **Input Sanitization**: Trims whitespace and validates non-empty strings
- **Path Traversal Protection**: Blocks `../`, `..\\`, and `..` sequences
- **Absolute Path Blocking**: Prevents paths starting with `/`, `\`, or Windows
  drives (`C:`)
- **Command Injection Prevention**: Blocks dangerous shell metacharacters: `;`
  `|` `&` `$` `` ` `` `<` `>` `'` `"` `\`
- **File System Protection**: Prevents reserved file system characters: `<` `>`
  `:` `"` `/` `|` `?` `*`
- **Character Validation**: Only allows letters, numbers, hyphens, and
  underscores (`^[a-zA-Z0-9_-]+$`)
- **Length Validation**: Maximum 100 characters

**Examples:**

```bash
# Generate a user model
mikrus generate user
# Output: Generated file at models/user-model.ts

# Generate with alias
mikrus g product
# Output: Generated file at models/product-model.ts

# Valid naming patterns
mikrus generate user-profile    # ✅ Valid
mikrus generate user_data       # ✅ Valid
mikrus generate UserModel       # ✅ Valid

# Invalid examples (will fail with security errors)
mikrus generate ../malicious      # ❌ Path traversal detected
mikrus generate "file; rm -rf"    # ❌ Command injection characters detected  
mikrus generate /absolute/path    # ❌ Absolute paths not allowed
mikrus generate "file with spaces" # ❌ Spaces not allowed
mikrus generate ""                # ❌ Empty name not allowed
mikrus generate C:\\windows\\file  # ❌ Windows absolute path blocked
```

**Generated Files:**

- **Location**: `models/<name>-model.ts`
- **Template**: Uses `src/templates/model.ts.ejs`
- **Content**: CommonJS module with the specified name

**Error Handling:** All validation failures result in:

- Clear error message describing the specific security issue
- Process exit with code 1
- No file generation or side effects
- Error messages are safe and don't expose sensitive system information

**Common Error Messages:**

- `Name parameter is required and must be a string`
- `Name parameter cannot be empty`
- `Path traversal detected. Name parameter cannot contain ".." sequences`
- `Absolute paths are not allowed. Name parameter must be a relative filename`
- `Invalid characters detected. Name parameter cannot contain: ; | & $` < > ' "
  \`
- `Name parameter contains reserved file system characters`
- `Name parameter is too long. Maximum length is 100 characters`
- `Name parameter must contain only letters, numbers, hyphens, and underscores`

---

### `mikrus help` (alias: `-h`, `--help`)

Displays help information for the CLI and available commands.

**Usage:**

```bash
mikrus help
mikrus --help
mikrus -h
```

---

### `mikrus version` (alias: `-v`, `--version`)

Shows the current version of the mikrus CLI.

**Usage:**

```bash
mikrus version
mikrus --version
mikrus -v
```

**Output:**

```
0.0.1
```

---

## Global Options

These options are available for all commands:

- `--help`, `-h` - Show help information
- `--version`, `-v` - Display version number
- `--compiled-build` - Force running compiled JavaScript version

## Security Features

The mikrus CLI implements enterprise-level security measures:

1. **Input Validation**: All user inputs are validated and sanitized
2. **Path Security**: File operations restricted to project directory
3. **Injection Prevention**: Protection against command injection attacks
4. **Error Handling**: Secure error messages without sensitive information
   disclosure

## Exit Codes

- `0` - Success
- `1` - Security validation failure or command error

## Development

For development usage with TypeScript source:

```bash
# Runs from TypeScript source (development)
mikrus generate test-model

# Forces compiled version
mikrus --compiled-build generate test-model
```

## Examples

### Basic Usage

```bash
# Initialize a new model
mikrus generate user

# Check version
mikrus --version

# Get help
mikrus --help
```

### Security Examples

```bash
# These will be blocked for security:
mikrus generate "../../../etc/passwd"     # Path traversal
mikrus generate "model; cat /etc/passwd"  # Command injection  
mikrus generate "/tmp/malicious"          # Absolute path
mikrus generate "model name"              # Spaces not allowed
mikrus generate "model*file"              # Reserved characters
mikrus generate "C:\\temp\\model"         # Windows absolute path

# These are safe and allowed:
mikrus generate my-model                  # Hyphenated names ✅
mikrus generate user_profile             # Underscored names ✅  
mikrus generate ProductData              # CamelCase names ✅
mikrus generate model123                 # Numbers allowed ✅
mikrus generate a                        # Single character ✅
```

---

**Last Updated**: 2025-08-25\
**Repository**: https://github.com/gander-tools/mikrus
