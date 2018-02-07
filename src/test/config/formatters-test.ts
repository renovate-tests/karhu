import {prepareTestKarhu} from '../test-utils'
import {KarhuConfig} from '../../main/karhu'

describe('format-before-test', () => {

  describe('functionality', () => {

    const karhuTest = prepareTestKarhu({
      formatters: {
        banana: (toLog: any[], logLevel: string, context: string, config: KarhuConfig, colorStart: string, colorEnd: string) => {
          return 'Overridden'
        }
      },
      outputFormat: 'banana'
    })

    it('allows replacing the prefix', karhuTest((karhu, output) => {
      karhu.context('test-context').info('Hello')
      expect(output.tracked).toMatchSnapshot()
    }))
  })

  describe('args', () => {
    let args: any

    const karhuTest = prepareTestKarhu({
      formatters: {
        banana: (toLog: any[], logLevel: string, context: string, config: KarhuConfig, colorStart: string, colorEnd: string) => {
          args = [toLog, logLevel, context, colorStart, colorEnd]
          return 'Overridden'
        }
      },
      outputFormat: 'banana'
    })

    it('is called with the right arguments', karhuTest((karhu, output) => {
      karhu.context('test-context').warn('Hello', 1, {a: 1})
      expect(args).toMatchSnapshot()
    }))
  })
})
