import {color as ansiColor, bgColor} from 'ansi-styles'
import {KarhuConfig} from '../main/karhu'
import {karhuInspect} from '../main/util'
import {inspect} from 'util'

export const logLevels = [
  'NONE', // Not to be used for messages, but allows setting log level to NONE,
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR'
]

const colors = {
  DEBUG: ansiColor.magentaBright,
  WARN: ansiColor.yellowBright,
  ERROR: [ansiColor.whiteBright, bgColor.bgRedBright],
}

const defaultConfig: KarhuConfig = {
  logLevels,
  colors,
  outputFormat: process.env.KARHU_JSON ? 'json' : 'text',
  formatters: {
    text: (toLog: any[], logLevel: string, context: string, config: KarhuConfig, colorStart: string, colorEnd: string) =>
      `[${config.formatNow(config)}] ${colorStart}${logLevel} ${context} ${toLog.map(val => karhuInspect(val)).join(' ')}${colorEnd}`,
    json: (toLog: any[], logLevel: string, context: string, config: KarhuConfig) => {
      const output = {timestamp: config.formatNow(config), context, logLevel, details: toLog}
      try {
        return JSON.stringify(output)
      } catch (err) {
        const fixed = {...output, details: inspect(output.details, {depth: 5, breakLength: Infinity})}
        return JSON.stringify(fixed)
      }
    }
  },
  contextSpecificLogLevels: new Map(),
  defaultLogLevel: 'INFO',
  envVariablePrefix: 'KARHU',
  outputMapper: value => value,
  outputImpl: {
    ERROR: (toLog) => console.error(toLog), /* tslint:disable-line:no-console */
    WARN: (toLog) => console.warn(toLog), /* tslint:disable-line:no-console */
    default: (toLog) => console.log(toLog) /* tslint:disable-line:no-console */
  },
  formatNow: () => new Date().toISOString()
}

export default defaultConfig
