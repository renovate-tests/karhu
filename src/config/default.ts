import {color as ansiColor, bgColor} from 'ansi-styles'
import {KarhuConfig} from '../main/karhu'
export const logLevels = [
  'NONE', // Not to be used for messages, but allows setting log level to NONE,
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR'
]

export const colors = {
  DEBUG: ansiColor.purpleBright,
  WARN: ansiColor.yellowBright,
  ERROR: [ansiColor.whiteBright, bgColor.bgRedBright],
  NOTICE: ansiColor.blueBright
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
  envVariablePrefix: 'KARHU',
  outputMapper: value => value,
  outputImpl: {
    ERROR: (...toLog) => console.error(...toLog), /* tslint:disable-line:no-console */
    WARN: (...toLog) => console.warn(...toLog), /* tslint:disable-line:no-console */
    default: (...toLog) => console.log(...toLog) /* tslint:disable-line:no-console */
  }
}

export default config
