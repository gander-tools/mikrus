import type { GluegunToolbox } from 'gluegun'
import type { MikrusToolbox } from '../types'

/**
 * Extends the Gluegun toolbox with mikrus-specific functionality
 * @param toolbox - The Gluegun toolbox instance
 */
module.exports = (toolbox: GluegunToolbox) => {
  const mikrusToolbox = toolbox as MikrusToolbox

  /**
   * Utility function for mikrus CLI operations
   * Can be used by commands for common functionality
   */
  mikrusToolbox.foo = () => {
    mikrusToolbox.print.info('Mikrus CLI utility function called')
  }

  // Configuration loading - uncomment and customize if needed
  // mikrusToolbox.config = {
  //   ...mikrusToolbox.config,
  //   ...mikrusToolbox.config.loadConfig("mikrus", process.cwd())
  // }
}
