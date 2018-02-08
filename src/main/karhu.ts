import defaultConfigImpl from '../config/default'
import {Color} from 'ansi-styles'
import {logLevelsMatch} from './util'

type Context = string
type LogLevel = string

export interface KarhuOutputImpl {
  [logLevel: string]: (toLog: any, logLevel: string, context: string, config: KarhuConfig) => void
}

export interface KarhuConfig {
  logLevels: string[]
  colors: {
    [logLevel: string]: Color | Color[]
  }
  outputFormat: string
  formatters: {
    [outputFormat: string]: (toLog: any[], logLevel: string, context: string, config: KarhuConfig, colorStart: string, colorEnd: string) => any,
  }
  contextSpecificLogLevels: {
    [context: string]: LogLevel
  }
  defaultLogLevel: LogLevel
  envVariablePrefix: string,
  outputMapper: (value: any, logLevel: string, context: string, toLog: any[]) => any,
  outputImpl: KarhuOutputImpl,
  formatNow: (config: KarhuConfig) => string | number
}

const noColor = {
  open: '',
  close: ''
}

export type LogFunction = (...toLog: any[]) => void

export interface KarhuLogger {
  error: LogFunction
  ERROR: LogFunction
  warn: LogFunction
  WARN: LogFunction
  info: LogFunction
  INFO: LogFunction
  debug: LogFunction
  DEBUG: LogFunction
}

let defaultConfig: KarhuConfig | undefined

if (!defaultConfig) defaultConfig = loadConfig()

function loadConfig(newConfig: KarhuConfig | null = null): KarhuConfig {
  const config = newConfig || defaultConfigImpl
  if (!config.formatters[config.outputFormat]) throw new Error('There is no formatter for chosen output format')
  return config
}

export function configure(config: null | KarhuConfig) {
  defaultConfig = loadConfig(config)
}

export interface Karhu<LogImpl> {
  context: (context: string) => LogImpl
  reconfigure: (newConfig: Partial<KarhuConfig>) => void
}

export const context = (activeContext: Context) => usingConfig(() => required(defaultConfig)).context(activeContext)

export function usingConfig<LogImpl = KarhuLogger>(configSource: KarhuConfig | (() => KarhuConfig)): Karhu<LogImpl> {
  const config = typeof configSource === 'function' ? configSource() : configSource

  return {
    context: forContext,
    reconfigure
  }

  function forContext(activeContext: string) {
    const impl: any = {}
    for (const type of config.logLevels) {
      impl[type] = (...toLog: any[]) => logEvent(config, activeContext, type, toLog)
      const typeLower = type.toLowerCase()
      if (!impl[typeLower]) {
        impl[typeLower] = (...toLog: any[]) => logEvent(config, activeContext, type, toLog)
      }
    }

    return impl as LogImpl
  }

  function reconfigure(newConfig: Partial<KarhuConfig>) {
    if (newConfig.logLevels && !logLevelsMatch(config.logLevels, newConfig.logLevels)) {
      throw new Error('Log levels cannot be updated with reconfigure')
    }
    Object.assign(config, newConfig)
  }
}

function logEvent(config: KarhuConfig, activeContext: string, logLevel: string, toLog: any[]) {
  const eventLogPrio = config.logLevels.indexOf(logLevel),
    activeLogLevelPrio = config.logLevels.indexOf(getLogLevel(config, activeContext))

  if (eventLogPrio < activeLogLevelPrio) return

  const
      colorEnabled = isColorEnabled(config),
    color = colorEnabled ? config.colors[logLevel] || config.colors.default || noColor : noColor,
    openColor = asArray(color).map(c => c.open).join(''),
    closeColor = asArray(color).reverse().map(c => c.close).join(''),
    mappedValues = toLog.map(value => config.outputMapper(value, logLevel, activeContext, toLog)),
    outputImpl = config.outputImpl[logLevel] || config.outputImpl.default

  const formatted = config.formatters[config.outputFormat](mappedValues, logLevel, activeContext, config, openColor, closeColor)
  outputImpl(formatted, logLevel, activeContext, config)
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

function isColorEnabled(config: KarhuConfig) {
  const override = process.env[config.envVariablePrefix + '_COLOR']
  if (override === '0' || override === 'false') return false
  if (override === '1' || override === 'true') return true
  return process.stdout.isTTY
}
