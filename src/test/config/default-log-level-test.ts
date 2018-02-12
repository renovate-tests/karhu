import {prepareTestKarhu} from '../test-utils'

describe('default-log-level-test', () => {
  describe('global', () => {
    const karhuTest = prepareTestKarhu({
      defaultLogLevel: 'WARN'
    })
    it('allows filtering messages that do not meet a priority threshold (unless overridden)', karhuTest((karhu, output) => {
      const ctx = karhu.context('test-context')
      ctx.error('Should show up')
      ctx.warn('Should also show up')
      ctx.info('Nope')
      ctx.debug('Not this either')
      expect(output.tracked).toMatchSnapshot()
    }))
  })

  describe('transport can have a different log level', () => {
    const karhuTest = prepareTestKarhu(
      {
        defaultLogLevel: 'WARN'
      },
      {
        defaultLogLevel: 'ERROR'
      }
    )

    it('allows filtering messages that do not meet a priority threshold (unless overridden)', karhuTest((karhu, output) => {
      const ctx = karhu.context('test-context')
      ctx.error('Should show up')
      ctx.warn('Should not show up')
      expect(output.tracked).toMatchSnapshot()
    }))
  })
})
