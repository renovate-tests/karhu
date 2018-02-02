import defaultConfigImpl from '../config/default'
import {Color} from 'ansi-styles'

type Context = string
type LogLevel = string

export interface JellogyConfig {
  logLevels: string[]
  colors: {
    [logLevel: string]: Color | Color[]
  }
  formatBefore: (logLevel: string, context: string, colorANSI: string) => string,
  contextSpecificLogLevels: {
    [context: string]: LogLevel
  }
  defaultLogLevel: LogLevel
  envVariable: string
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

let defaultConfig: JellogyConfig | undefined

if (!defaultConfig) defaultConfig = loadConfig()

function loadConfig(newConfig: JellogyConfig | null = null): JellogyConfig {
  return newConfig || defaultConfigImpl
}

export function configure(config: null | JellogyConfig) {
  defaultConfig = loadConfig(config)
}

export const context = (activeContext: Context) => usingConfig(() => required(defaultConfig)).context(activeContext)

export function usingConfig<LogImpl = DefaultLogImpl>(configSource: JellogyConfig | (() => JellogyConfig)) {
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

function logEvent(config: JellogyConfig, activeContext: string, logLevel: string, toLog: any[]) {

  if (config.logLevels.indexOf(logLevel) >= config.logLevels.indexOf(getLogLevel(config, activeContext))) return
  const color = config.colors[logLevel] || config.colors.default || noColor
  const openColor = asArray(color).map(c => c.open).join('')
  const before = config.formatBefore(logLevel, activeContext, openColor)
  if (process.stdout.isTTY) {
    const closeColor = asArray(color).reverse().map(c => c.close).join('')
    console.log(before, ...toLog, closeColor) /* tslint:disable-line:no-console */
  } else {
    console.log(before, ...toLog) /* tslint:disable-line:no-console */
  }
}

function getLogLevel(config: JellogyConfig, activeContext: Context) {
  return getOverrideLogLevel(config, activeContext) || config.contextSpecificLogLevels[activeContext] || config.defaultLogLevel
}

function getOverrideLogLevel(config: JellogyConfig, activeContext: Context) {
  return process.env[config.envVariable + '_' + toEnv(activeContext)] || process.env[config.envVariable]
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
