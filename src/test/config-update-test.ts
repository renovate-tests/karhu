import {prepareTestKarhu} from './test-utils'

describe('config-update-test', () => {
  const karhuTest = prepareTestKarhu({})

  it('is possible to update configuration when running', karhuTest((karhu, output) => {
    const ctx = karhu.context('test')
    ctx.debug('This should not show up')
    karhu.reconfigure({defaultLogLevel: 'DEBUG'})
    ctx.debug('This should show up')
    expect(output.tracked).toMatchSnapshot()
  }))

  it('is not possible to update log levels', karhuTest((karhu, output) => {
    expect(() => karhu.reconfigure({logLevels: ['KEK']}))
      .toThrowErrorMatchingSnapshot()
  }))
})
