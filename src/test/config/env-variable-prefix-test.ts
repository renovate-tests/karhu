import {prepareTestKarhu} from '../test-utils'

describe('env-variable-prefix-test', () => {
  const karhuTest = prepareTestKarhu({
    envVariablePrefix: 'KUHA'
  })

  beforeEach(() => {
    process.env.KUHA_COLOR = '1'
  })

  describe('allows using a different prefix', () => {
    it('applies on COLOR variable', karhuTest((karhu, output) => {
      process.env.KUHA_COLOR = '1'
      karhu.context('ctx').error('should have color')
      process.env.KUHA_COLOR = '0'
      karhu.context('ctx').error('should not have color')
      expect(output.tracked).toMatchSnapshot()
    }))

    it('applies to default log level override', karhuTest((karhu, output) => {
      process.env.KUHA_LOG_LEVEL = 'WARN'
      karhu.context('ctx').warn('should show up')
      process.env.KUHA_LOG_LEVEL = 'ERROR'
      karhu.context('ctx').warn('should not show up')
      process.env.KUHA_LOG_LEVEL = ''
      expect(output.tracked).toMatchSnapshot()
    }))

    it('applies to context specific overrides', karhuTest((karhu, output) => {
      process.env.KUHA_LOG_LEVEL_highprio = 'DEBUG'
      karhu.context('basic').debug('should not show up')
      karhu.context('highprio').debug('should show up')
      expect(output.tracked).toMatchSnapshot()
    }))
  })
})
