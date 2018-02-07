import {prepareTestKarhu} from '../test-utils'

describe('context-specific-log-levels-test', () => {
  const karhuTest = prepareTestKarhu({
    contextSpecificLogLevels: {
      'very-important': 'DEBUG'
    },
    defaultLogLevel: 'WARN'
  })

  it('allows overriding the default log level for individual contexts', karhuTest((karhu, output) => {
    karhu.context('not-so-important').debug('This should not show up')
    karhu.context('very-important').debug('This should show up')

    expect(output.tracked).toMatchSnapshot()
  }))
})
