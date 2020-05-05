// @ts-ignore
import * as ansiStyles1 from 'ansi-styles'
const ansiStyles = ansiStyles1 as AnsiStyles
import {KarhuConfig, KarhuTransport} from '../main/karhu'
import {karhuInspect} from '../main/util'
import {inspect} from 'util'
import defaultOutputImpl from '../main/default-output-impl'
import {AnsiStyles} from '../ansi-styles'

export const logLevels = [
  'NONE', // Not to be used for messages, but allows setting log level to NONE,
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR'
]

const colors = {
  DEBUG: ansiStyles.color.magentaBright,
  WARN: ansiStyles.color.yellowBright,
  ERROR: [ansiStyles.color.whiteBright, ansiStyles.bgColor.bgRedBright],
}

const defaultConfig: KarhuConfig = {
  logLevels,
  colors,
  outputFormat: process.env.KARHU_JSON ? 'json' : 'text',
  formatters: {
    text: (toLog: any[], logLevel: string, context: string, config: KarhuConfig, colorStart: string, colorEnd: string, transport: KarhuTransport) => {
      const contextualData = config.getContextualData?.()
      const formattedContextualData = contextualData !== undefined ? ' ' + karhuInspect(contextualData) : ''
      return `[${(transport.formatNow || config.formatNow)(config)}] ${colorStart}${logLevel} ${context} ${toLog.map(val => karhuInspect(val)).join(' ')}${formattedContextualData}${colorEnd}`
    },
    json: (toLog: any[], logLevel: string, context: string, config: KarhuConfig, colorStart: string, colorEnd: string, transport: KarhuTransport) => {
      const contextualData = config.getContextualData?.()
      const contextualDataObj = typeof contextualData === 'object' ? contextualData : {contextualData}
      const output = {timestamp: (transport.formatNow || config.formatNow)(config), context, logLevel, details: toLog, ...contextualDataObj}
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
  transports: {
    console: defaultOutputImpl
  },
  formatNow: () => new Date().toISOString()
}

export default defaultConfig
