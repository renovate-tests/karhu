import {color as ansiColor, bgColor} from 'ansi-styles'
import {prepareTestKarhu} from '../test-utils'

describe('log-levels-test', () => {
  describe('no default', () => {
    const karhuTest = prepareTestKarhu({
      colors: {
        WARN: ansiColor.magentaBright,
        ERROR: [ansiColor.blueBright, bgColor.bgRedBright]
      }
    })

    it('is able to use custom log levels', karhuTest((karhu, output) => {
      karhu.context('test-context').info('No color')
      karhu.context('test-context').warn('Single color')
      karhu.context('test-context').error('Multiple colors')

      expect(output.tracked).toMatchSnapshot()
    }))
  })
})
