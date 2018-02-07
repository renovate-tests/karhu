import {prepareTestKarhu} from '../test-utils'

describe('format-before-test', () => {

  describe('functionality', () => {

    const karhuTest = prepareTestKarhu({
      formatBefore: (logLevel: string, context: string, colorANSI: string, toLog: any[]) => {
        return 'Overridden'
      }
    })

    it('allows replacing the prefix', karhuTest((karhu, output) => {
      karhu.context('test-context').info('Hello')
      expect(output.tracked).toMatchSnapshot()
    }))
  })

  describe('args', () => {
    let args: any

    const karhuTest = prepareTestKarhu({
      formatBefore: (logLevel: string, context: string, colorANSI: string, toLog: any[]) => {
        args = [logLevel, context, colorANSI, toLog]
        return 'Overridden'
      }
    })

    it('is called with the right arguments', karhuTest((karhu, output) => {
      karhu.context('test-context').warn('Hello', 1, {a: 1})
      expect(args).toMatchSnapshot()
    }))
  })
})
