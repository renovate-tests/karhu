import defaultConfig from './default'
// @ts-ignore
import * as ansiStyles1 from 'ansi-styles'
const ansiStyles = ansiStyles1 as AnsiStyles
import {KarhuConfig} from '../main/karhu'
import {AnsiStyles} from '../ansi-styles'

const jelppConfig: KarhuConfig = {
  ...defaultConfig,
  defaultLogLevel: process.env.KARHU_LOG_LEVEL || process.env.NODE_LOG_LEVEL || 'INFO',
  colors: {
    ...defaultConfig.colors,
    NOTICE: ansiStyles.color.blueBright
  },
  logLevels: updatedLogLevels(),
  outputMapper,
  outputFormat: (process.env.KARHU_JSON || (process.stdout && !process.stdout.isTTY)) && !process.env.KARHU_NO_JSON ? 'json' : 'text',
}

export default jelppConfig

function updatedLogLevels() {
  const ll = [...defaultConfig.logLevels]
  ll.splice(ll.indexOf('WARN'), 0, 'NOTICE')
  return ll
}

function outputMapper(val: any) {
  return errorOutputMapper(requestPromiseOutputMapper(val))
}

function errorOutputMapper(val: any) {
  if (val instanceof Error && val.stack) {
    return `${val.message} ${val.stack}`
  }
  return val
}

function requestPromiseOutputMapper(val: any) {
  if (val instanceof Error && val.name === 'StatusCodeError') {
    const err = val as any
    return `StatusCodeError: ${err.statusCode} ${val.message}\n\n${err.response && err.response.body}\n\n${err.stack}`
  }
  return val
}
