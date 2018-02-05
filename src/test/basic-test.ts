import {prepareTestKarhu} from './test-utils'

describe('basic-test', () => {
  const karhuTest = prepareTestKarhu({})

  it('logs things', karhuTest((karhu, output) => {
    karhu.context('test-context').info('Hello, world!')
    expect(output.tracked).toMatchSnapshot()
  }))
})
