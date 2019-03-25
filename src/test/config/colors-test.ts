// @ts-ignore
import * as ansiStyles1 from 'ansi-styles'
const {color: ansiColor, bgColor} = ansiStyles1 as AnsiStyles
import {prepareTestKarhu} from '../test-utils'
import {KarhuLogger, LogFunction} from '../../main/karhu'
import defaultConfig from '../../config/default'
import {AnsiStyles} from '../../ansi-styles'

interface PotatoLogger extends KarhuLogger {
  potato: LogFunction
}

describe('colors-test', () => {
  describe('no default', () => {
    const karhuTest = prepareTestKarhu<PotatoLogger>({
      logLevels: [...defaultConfig.logLevels, 'POTATO'],
      colors: {
        WARN: ansiColor.magentaBright,
        ERROR: [ansiColor.blueBright, bgColor.bgRedBright],
        POTATO: [ansiColor.redBright]
      }
    })

    it('colors of various log levels work', karhuTest((karhu, output) => {
      karhu.context('test-context').info('No color')
      karhu.context('test-context').warn('Single color')
      karhu.context('test-context').error('Multiple colors')

      expect(output.tracked).toMatchSnapshot()
    }))

    it('colors can be applied to custom log levels', karhuTest((karhu, output) => {
      karhu.context('test-context').potato('Custom log level')

      expect(output.tracked).toMatchSnapshot()
    }))

    it('colors can be disabled', karhuTest((karhu, output) => {
      process.env.KARHU_COLOR = 'false'
      karhu.context('test-context').error('no color')
      process.env.KARHU_COLOR = 'true'

      expect(output.tracked).toMatchSnapshot()
    }))
  })

  describe('with default', () => {
    const karhuTest = prepareTestKarhu({
      colors: {
        WARN: ansiColor.magentaBright,
        default: ansiColor.redBright
      }
    })

    it('specified colors are used', karhuTest((karhu, output) => {
      karhu.context('test-context').warn('Specified color')
      expect(output.tracked).toMatchSnapshot()
    }))

    it('default is used as a fallback', karhuTest((karhu, output) => {
      karhu.context('test-context').error('Default color')
      expect(output.tracked).toMatchSnapshot()
    }))
  })

  describe('transport can override colors', () => {
    const karhuTest = prepareTestKarhu({}, {
      colors: {
        WARN: ansiColor.yellowBright,
      }
    })

    it('specified colors are used', karhuTest((karhu, output) => {
      karhu.context('test-context').warn('Yellow')
      expect(output.tracked).toMatchSnapshot()
    }))
  })
})
