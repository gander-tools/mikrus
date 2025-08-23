import type { GluegunToolbox } from 'gluegun'

/**
 * Validates and sanitizes user input to prevent security vulnerabilities
 */
function validateAndSanitizeInput(input: string | undefined): string {
  // Check if input is provided
  if (!input || typeof input !== 'string') {
    throw new Error('Name parameter is required and must be a string')
  }

  // Trim whitespace
  const trimmed = input.trim()

  // Check for empty input after trimming
  if (trimmed.length === 0) {
    throw new Error('Name parameter cannot be empty')
  }

  // Path traversal protection - prevent directory traversal attacks
  if (
    trimmed.includes('../') ||
    trimmed.includes('..\\') ||
    trimmed.includes('..')
  ) {
    throw new Error(
      'Path traversal detected. Name parameter cannot contain ".." sequences'
    )
  }

  // Absolute path protection
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('\\') ||
    /^[a-zA-Z]:/.test(trimmed)
  ) {
    throw new Error(
      'Absolute paths are not allowed. Name parameter must be a relative filename'
    )
  }

  // Command injection protection - remove dangerous shell metacharacters
  const dangerousChars = /[;|&$`<>'"\\]/
  if (dangerousChars.test(trimmed)) {
    throw new Error(
      'Invalid characters detected. Name parameter cannot contain: ; | & $ ` < > \' " \\'
    )
  }

  // File system reserved characters protection
  const reservedChars = /[<>:"/|?*]/
  if (reservedChars.test(trimmed)) {
    throw new Error('Name parameter contains reserved file system characters')
  }

  // Length validation
  if (trimmed.length > 100) {
    throw new Error(
      'Name parameter is too long. Maximum length is 100 characters'
    )
  }

  // Valid filename pattern - alphanumeric, hyphens, underscores only
  const validPattern = /^[a-zA-Z0-9_-]+$/
  if (!validPattern.test(trimmed)) {
    throw new Error(
      'Name parameter must contain only letters, numbers, hyphens, and underscores'
    )
  }

  return trimmed
}

module.exports = {
  name: 'generate',
  alias: ['g'],
  run: async (toolbox: GluegunToolbox) => {
    const {
      parameters,
      template: { generate },
      print: { info, error },
    } = toolbox

    try {
      // Validate and sanitize the input
      const name = validateAndSanitizeInput(parameters.first)

      await generate({
        template: 'model.ts.ejs',
        target: `models/${name}-model.ts`,
        props: { name },
      })

      info(`Generated file at models/${name}-model.ts`)
    } catch (err) {
      error(`Security validation failed: ${err.message}`)
      process.exit(1)
    }
  },
}
