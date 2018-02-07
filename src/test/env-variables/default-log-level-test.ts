import {prepareTestKarhu} from '../test-utils'

describe('default-log-level-test', () => {
  const karhuTest = prepareTestKarhu({
    defaultLogLevel: 'ERROR'
  })

  it('allows overriding default log level', karhuTest((karhu, output) => {
    karhu.context('test-context').warn('Should not show up')
    process.env.KARHU_LOG_LEVEL = 'WARN'
    karhu.context('test-context').warn('Should show up')
    process.env.KARHU_LOG_LEVEL = undefined
    expect(output.tracked).toMatchSnapshot()
  }))
})
