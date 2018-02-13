import defaultConfigImpl from '../config/default'
import {Color} from 'ansi-styles'
import {logLevelsMatch} from './util'
import {enableStandardOutputCapture, toggleForceCaptureDisabled} from './capturer'

type Context = string
type LogLevel = string

type KarhuTransportFn = (toLog: any, logLevel: string, context: string, config: KarhuConfig) => void
interface KarhuTransportMap {
  [logLevel: string]: KarhuTransportFn
}

export interface KarhuReconfigurable {
  colors: {
    [logLevel: string]: Color | Color[]
  }
  outputFormat: string
  formatters: {
    [outputFormat: string]: (toLog: any[], logLevel: string, context: string, config: KarhuConfig, colorStart: string, colorEnd: string, transport: KarhuTransport) => any,
  }
  defaultLogLevel: LogLevel
  outputMapper: (value: any, logLevel: string, context: string, toLog: any[], index: number) => any,
  formatNow: (config: KarhuConfig) => string | number
}

export interface KarhuTransport extends Partial<KarhuReconfigurable> {
  supportsColor: boolean | (() => boolean)
  outputImpl: KarhuTransportMap
}

interface LogLevelMap {
  [context: string]: LogLevel
}

export interface KarhuConfig extends KarhuReconfigurable {
  logLevels: string[]
  contextSpecificLogLevels: Map<string | RegExp, LogLevel> | LogLevelMap
  envVariablePrefix: string,
  transports: { [name: string]: KarhuTransport}
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

let globalConfig: KarhuConfig | undefined

if (!globalConfig) globalConfig = loadConfig()

function loadConfig(newConfig: KarhuConfig | null = null): KarhuConfig {
  const config = newConfig || defaultConfigImpl
  if (!config.formatters[config.outputFormat]) throw new Error('There is no formatter for chosen output format')
  return config
}

export function configure(config: null | KarhuConfig) {
  globalConfig = loadConfig(config)
}

export interface Karhu<LogImpl> {
  context: (context: string) => LogImpl
  reconfigure: (newConfig: Partial<KarhuConfig>) => void
  getConfig: () => KarhuConfig
}

export const context = (activeContext: Context) => usingConfig(() => required(globalConfig)).context(activeContext)

export function getGlobalConfig() {
  return globalConfig
}

export function usingConfig<LogImpl = KarhuLogger>(configSource: KarhuConfig | (() => KarhuConfig)): Karhu<LogImpl> {
  const config = typeof configSource === 'function' ? configSource() : configSource

  return {
    context: forContext,
    reconfigure,
    getConfig: () => config
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
  const eventLogPrio = config.logLevels.indexOf(logLevel)

  for (const transportName of Object.keys(config.transports)) {
    const transport = config.transports[transportName]
    const activeLogLevelPrio = config.logLevels.indexOf(getLogLevel(config, transport, activeContext))

    if (eventLogPrio < activeLogLevelPrio) continue

    const
      colorEnabled = isColorEnabled(config, transport),
      color = colorEnabled ? getConfigColor(config, transport, logLevel) || noColor : noColor,
      openColor = asArray(color).map(c => c.open).join(''),
      closeColor = asArray(color).reverse().map(c => c.close).join(''),
      outputMapper = transport.outputMapper || config.outputMapper,
      mappedValues = toLog.map((value, i) => outputMapper(value, logLevel, activeContext, toLog, i)),
      outputImpl = transport.outputImpl[logLevel] || transport.outputImpl.default

    if (!outputImpl) throw new Error('Transport ' + transportName + ' does not support log level ' + logLevel + ' or default')

    const outputFormat = transport.outputFormat || config.outputFormat
    const formatter = (transport.formatters || {})[outputFormat] || config.formatters[outputFormat]
    const formatted = formatter(mappedValues, logLevel, activeContext, config, openColor, closeColor, transport)
    toggleForceCaptureDisabled(true)
    outputImpl(formatted, logLevel, activeContext, config)
    toggleForceCaptureDisabled(false)
  }
}

function getConfigColor(config: KarhuConfig, transport: KarhuTransport, logLevel: string) {
  const colors = transport.colors || config.colors
  return colors[logLevel] || colors.default
}

function getLogLevel(config: KarhuConfig, transport: KarhuTransport, activeContext: Context) {
  return getOverrideLogLevel(config, activeContext) || getContextSpecificOverrideFromContext() || getOverrideLogLevel(config, null) || transport.defaultLogLevel || config.defaultLogLevel

  function getContextSpecificOverrideFromContext() {
    if (!(config.contextSpecificLogLevels instanceof Map)) {
      return config.contextSpecificLogLevels[activeContext]
    }
    const perfectOverride = config.contextSpecificLogLevels.get(activeContext)
    if (perfectOverride) return perfectOverride
    for (const key of config.contextSpecificLogLevels.keys()) {
      if (key instanceof RegExp && key.test(activeContext)) {
        return config.contextSpecificLogLevels.get(key)
      }
    }
    return perfectOverride
  }
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

function isColorEnabled(config: KarhuConfig, transport: KarhuTransport): boolean {
  const override = process.env[config.envVariablePrefix + '_COLOR']
  if (override === '0' || override === 'false') return false
  if (override === '1' || override === 'true') return true
  return typeof transport.supportsColor === 'function' ? transport.supportsColor() : transport.supportsColor
}

export const captureStandardOutput = (logger: KarhuLogger, stdoutLogLevel = 'INFO', stderrLogLevel = 'ERROR') => {
  if (!logger) throw new Error('Please provide a logger in the proper context to captureStandardOutput')
  return enableStandardOutputCapture(logger, stdoutLogLevel, stderrLogLevel)
}
