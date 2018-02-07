import {prepareTestKarhu} from '../test-utils'

describe('default-log-level-test', () => {
  const karhuTest = prepareTestKarhu({})

  it('allows overriding default log level', karhuTest((karhu, output) => {
    process.env.KARHU_COLOR = 'true'
    karhu.context('test-context').error('Should have colors')
    process.env.KARHU_COLOR = 'false'
    karhu.context('test-context').error('Should not have colors')
    expect(output.tracked).toMatchSnapshot()
  }))
})
