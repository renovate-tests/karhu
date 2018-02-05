import {prepareTestKarhu} from './test-utils'

describe('default-log-levels-test', () => {
  const karhuTest = prepareTestKarhu({})

  it('specified case and lowercase calls work', karhuTest((karhu, output) => {
    const ctx = karhu.context('ctx')
    ctx.ERROR('error1')
    ctx.error('error2')
    expect(output.tracked).toMatchSnapshot()
  }))
})
