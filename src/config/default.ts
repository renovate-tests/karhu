import {styles} from 'ansi-styles'
import {KarhuConfig} from '../main/karhu'
export const logLevels = [
  'NONE', // Not to be used for messages, but allows setting log level to NONE,
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR'
]

export const colors = {
  DEBUG: styles.color.purpleBright,
  WARN: styles.color.yellowBright,
  ERROR: [styles.color.whiteBright, styles.bgColor.redBright],
  NOTICE: styles.color.blueBright
}

function formatBefore(logLevel: string, context: string, color: string) {
  return `[${new Date().toISOString()}] ${color}${logLevel} ${context}`
}

const config: KarhuConfig = {
  logLevels,
  colors,
  formatBefore,
  contextSpecificLogLevels: {},
  defaultLogLevel: 'INFO',
  envVariable: 'KARHU_LOG_LEVEL'
}

export default config
