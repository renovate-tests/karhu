import {prepareTestKarhu} from '../test-utils'

describe('context-log-level-test', () => {
  const karhuTest = prepareTestKarhu({
    defaultLogLevel: 'ERROR',
    contextSpecificLogLevels: {
      ctx: 'ERROR'
    }
  })

  it('allows overriding default log level', karhuTest((karhu, output) => {
    karhu.context('ctx').warn('Should not show up')
    process.env.KARHU_LOG_LEVEL_ctx = 'WARN'
    karhu.context('ctx').warn('Should show up')
    process.env.KARHU_LOG_LEVEL_ctx = undefined
    expect(output.tracked).toMatchSnapshot()
  }))

  it('non-alphanumeric character sequences are handled as underscores in env variable name', karhuTest((karhu, output) => {
    const context = 'a+-/b    c'
    karhu.context(context).warn('Should not show up')
    process.env.KARHU_LOG_LEVEL_a_b_c = 'WARN'
    karhu.context(context).warn('Should show up')
    process.env.KARHU_LOG_LEVEL_a_b_c = undefined
    expect(output.tracked).toMatchSnapshot()
  }))
})
