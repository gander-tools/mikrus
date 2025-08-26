import type { IncomingMessage } from 'node:http'
import type { GluegunToolbox } from 'gluegun'
import type { MikrusToolbox } from '../types'

/**
 * Extends the Gluegun toolbox with mikrus-specific functionality
 * @param toolbox - The Gluegun toolbox instance
 */
module.exports = (toolbox: GluegunToolbox) => {
  const mikrusToolbox = toolbox as MikrusToolbox

  /**
   * Validates that a string is a valid identifier for mikrus resources
   * @param name - The identifier to validate
   * @returns True if valid, false otherwise
   */
  mikrusToolbox.validateIdentifier = (name: string): boolean => {
    if (!name || typeof name !== 'string') {
      return false
    }

    // Valid identifier: letters, numbers, hyphens, underscores, 1-64 chars
    const identifierRegex = /^[a-zA-Z0-9_-]{1,64}$/
    return identifierRegex.test(name)
  }

  /**
   * Creates a formatted success message with emoji
   * @param message - The success message to display
   */
  mikrusToolbox.success = (message: string): void => {
    mikrusToolbox.print.success(`✅ ${message}`)
  }

  /**
   * Creates a formatted error message with emoji and exits
   * @param message - The error message to display
   * @param exitCode - The exit code (default: 1)
   */
  mikrusToolbox.error = (message: string, exitCode = 1): never => {
    mikrusToolbox.print.error(`❌ ${message}`)
    process.exit(exitCode)
  }

  /**
   * Checks if mikr.us API is reachable using Node.js built-in modules
   * @returns Promise that resolves to true if API is reachable
   */
  mikrusToolbox.checkApiConnectivity = async (): Promise<boolean> => {
    try {
      const https = require('node:https')
      const { URL } = require('node:url')

      const url = new URL('https://mikr.us/api/health')

      return new Promise((resolve) => {
        const req = https.request(
          {
            hostname: url.hostname,
            port: url.port || 443,
            path: url.pathname,
            method: 'HEAD',
            headers: { 'User-Agent': 'mikrus-cli/1.0.0' },
            timeout: 5000,
          },
          (res: IncomingMessage) => {
            resolve(res.statusCode! >= 200 && res.statusCode! < 400)
          }
        )

        req.on('error', (error: NodeJS.ErrnoException) => {
          mikrusToolbox.print.debug(
            `API connectivity check failed: ${error.message}`
          )
          resolve(false)
        })

        req.on('timeout', () => {
          req.destroy()
          mikrusToolbox.print.debug('API connectivity check timed out')
          resolve(false)
        })

        req.end()
      })
    } catch (error) {
      mikrusToolbox.print.debug(`API connectivity check failed: ${error}`)
      return false
    }
  }

  // Configuration loading - uncomment and customize if needed
  // mikrusToolbox.config = {
  //   ...mikrusToolbox.config,
  //   ...mikrusToolbox.config.loadConfig("mikrus", process.cwd())
  // }
}
