import {prepareTestKarhu} from './test-utils'
import {captureStandardOutput} from '../main/karhu'

describe('output-capture-test', () => {
  const karhuTest = prepareTestKarhu({})

  // Testing console.x functions is problematic as jest does its own overriding of them

  it('turns  into INFO by default', karhuTest((karhu, output) => {
    captureStandardOutput(karhu.context('test-context'))
    process.stdout.write('Hello\n')
    expect(output.tracked).toMatchSnapshot()
  }))

  it('turns stderr into ERROR by default', karhuTest((karhu, output) => {
    captureStandardOutput(karhu.context('test-context'))
    process.stderr.write('OMG\n')
    expect(output.tracked).toMatchSnapshot()
  }))

  it('log levels can be changed', karhuTest((karhu, output) => {
    captureStandardOutput(karhu.context('test-context'), 'WARN', 'INFO')
    process.stdout.write('Warn\n')
    process.stderr.write('Wut?\n')
    expect(output.tracked).toMatchSnapshot()
  }))

  it('can be aborted', karhuTest((karhu, output) => {
    captureStandardOutput(karhu.context('test-context')).abort()
    process.stdout.write('Please ignore this line')
    process.stderr.write('Please ignore this line')
    expect(output.tracked).toMatchSnapshot()
  }))
})
