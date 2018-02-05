import {prepareTestKarhu} from './test-utils'

describe('default-log-levels-test', () => {
  const karhuTest = prepareTestKarhu({ defaultLogLevel: 'DEBUG'})

  it('logs things', karhuTest((karhu, output) => {
    const context = karhu.context('test-context')
    context.debug('dbg')
    context.info('inf')
    context.warn('wrn')
    context.error('err')
    expect(output.tracked).toMatchSnapshot()
  }))
})
