import type { GluegunToolbox } from 'gluegun'

/**
 * Extended toolbox with custom CLI functionality
 */
export interface MikrusToolbox extends GluegunToolbox {
  foo(): void
}

/**
 * CLI command options interface
 */
export interface MikrusCommandOptions {
  name?: string
  help?: boolean
  version?: boolean
}

/**
 * Generate command parameters
 */
export interface GenerateCommandParams {
  first?: string
}
