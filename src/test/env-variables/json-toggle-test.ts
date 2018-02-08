process.env.KARHU_JSON = 'true'
import {prepareTestKarhu} from '../test-utils'

describe('json-toggle-test', () => {
  const karhuTest = prepareTestKarhu({})

  it('the default config produces json if KARHU_JSON is set to a truthy value', karhuTest((karhu, output) => {
    karhu.context('test-context').error('Should be json', {value: true})
    expect(output.tracked).toMatchSnapshot()
  }))
})
