import defaultConfigImpl from '../config/default'
import {Color} from 'ansi-styles'

type Context = string
type LogLevel = string

export interface KarhuConfig {
  logLevels: string[]
  colors: {
    [logLevel: string]: Color | Color[]
  }
  formatBefore: (logLevel: string, context: string, colorANSI: string, toLog: any[]) => string,
  contextSpecificLogLevels: {
    [context: string]: LogLevel
  }
  defaultLogLevel: LogLevel
  envVariablePrefix: string,
  outputMapper: (value: any, logLevel: string, context: string, toLog: any[]) => any
}

const noColor = {
  open: '',
  close: ''
}

export type LogFunction = (...toLog: any[]) => void

export interface DefaultLogImpl {
  error: LogFunction
  warn: LogFunction
  info: LogFunction
  debug: LogFunction
}

let defaultConfig: KarhuConfig | undefined

if (!defaultConfig) defaultConfig = loadConfig()

function loadConfig(newConfig: KarhuConfig | null = null): KarhuConfig {
  return newConfig || defaultConfigImpl
}

export function configure(config: null | KarhuConfig) {
  defaultConfig = loadConfig(config)
}

export const context = (activeContext: Context) => usingConfig(() => required(defaultConfig)).context(activeContext)

export function usingConfig<LogImpl = DefaultLogImpl>(configSource: KarhuConfig | (() => KarhuConfig)) {
  const config = typeof configSource === 'function' ? configSource() : configSource

  return {
    context: forContext
  }

  function forContext(activeContext: string) {
    const impl: any = {}
    for (const type of config.logLevels) {
      impl[type.toLowerCase()] = (...toLog: any[]) => logEvent(config, activeContext, type, toLog)
    }

    return impl as LogImpl
  }
}

function logEvent(config: KarhuConfig, activeContext: string, logLevel: string, toLog: any[]) {

  if (config.logLevels.indexOf(logLevel) >= config.logLevels.indexOf(getLogLevel(config, activeContext))) return
  const color = config.colors[logLevel] || config.colors.default || noColor
  const openColor = asArray(color).map(c => c.open).join('')
  const before = config.formatBefore(logLevel, activeContext, openColor, toLog)
  const mappedValues = toLog.map(value => config.outputMapper(value, logLevel, activeContext, toLog))
  if (process.stdout.isTTY && before.includes(openColor)) {
    const closeColor = asArray(color).reverse().map(c => c.close).join('')
    console.log(before, ...mappedValues, closeColor) /* tslint:disable-line:no-console */
  } else {
    console.log(before, ...mappedValues) /* tslint:disable-line:no-console */
  }
}

function getLogLevel(config: KarhuConfig, activeContext: Context) {
  return getOverrideLogLevel(config, activeContext) || config.contextSpecificLogLevels[activeContext] || getOverrideLogLevel(config, null) || config.defaultLogLevel
}

function getOverrideLogLevel(config: KarhuConfig, activeContext: Context | null) {
  const prefix = config.envVariablePrefix + '_LOG_LEVEL'
  return process.env[!activeContext ? prefix : prefix + '_' + toEnv(activeContext)]
}

function toEnv(activeContext: Context) {
  return activeContext.replace(/[^a-zA-Z0-9]+/g, '_')
}

function required<T>(val: T | undefined): T {
  if (!val) throw new Error('Required value missing')
  return val
}

function asArray<T>(inVal: T | T[]): T[] {
  if (inVal instanceof Array) return inVal
  return [inVal]
}
