import defaultConfig from './default'
import {color as ansiColor} from 'ansi-styles'
import {KarhuConfig} from '../main/karhu'

const jelppConfig: KarhuConfig = {
  ...defaultConfig,
  defaultLogLevel: process.env.KARHU_LOG_LEVEL || process.env.NODE_LOG_LEVEL || 'INFO',
  colors: {
    ...defaultConfig.colors,
    NOTICE: ansiColor.blueBright
  },
  logLevels: updatedLogLevels(),
  outputMapper: requestPromiseOutputMapper
}

export default jelppConfig

function updatedLogLevels() {
  const ll = [...defaultConfig.logLevels]
  ll.splice(ll.indexOf('WARN'), 0, 'NOTICE')
  return ll
}

function requestPromiseOutputMapper(val: any) {
  if (val instanceof Error && val.name === 'StatusCodeError') {
    const err = val as any
    return `StatusCodeError: ${err.statusCode} ${val.message}\n\n${err.response && err.response.body}\n\n${err.stack}`
  }
  return val
}
