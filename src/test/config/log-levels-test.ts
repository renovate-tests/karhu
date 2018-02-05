import {prepareTestKarhu} from '../test-utils'
import {LogFunction} from '../../main/karhu'

interface LLT {
  alpha: LogFunction
}

describe('log-levels-test', () => {
  const karhuTest = prepareTestKarhu<LLT>({
    logLevels: [
      'ALPHA'
    ]
  })

  it('is able to use custom log levels', karhuTest((karhu, output) => {
    karhu.context('test-context').alpha('Hello, world!')
    expect(output.tracked).toMatchSnapshot()
  }))
})
