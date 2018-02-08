import {prepareTestKarhu} from '../test-utils'

describe('context-specific-log-levels-test', () => {
  const karhuTest = prepareTestKarhu({
    contextSpecificLogLevels: new Map<string | RegExp, string>([
      ['very-important', 'DEBUG'],
      ['long-match', 'DEBUG'],
      [/match/, 'INFO']
    ]),
    defaultLogLevel: 'WARN'
  })

  it('allows overriding the default log level for individual contexts', karhuTest((karhu, output) => {
    karhu.context('not-so-important').debug('This should not show up')
    karhu.context('very-important').debug('This should show up')

    expect(output.tracked).toMatchSnapshot()
  }))

  it('regexp are supported', karhuTest((karhu, output) => {
    karhu.context('this-should-match').info('This should show up')
    karhu.context('this-should-match').debug('This should not show up')
    expect(output.tracked).toMatchSnapshot()
  }))

  it('perfect match is preferred over regexp', karhuTest((karhu, output) => {
    karhu.context('long-match').debug('This should show up')
    expect(output.tracked).toMatchSnapshot()
  }))
})
