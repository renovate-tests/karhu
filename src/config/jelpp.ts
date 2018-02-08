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
  logLevels: updatedLogLevels()
}

export default jelppConfig

function updatedLogLevels() {
  const ll = [...defaultConfig.logLevels]
  ll.splice(ll.indexOf('WARN'), 0, 'NOTICE')
  return ll
}
