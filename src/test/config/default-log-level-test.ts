import {prepareTestKarhu} from '../test-utils'

describe('default-log-level-test', () => {
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
