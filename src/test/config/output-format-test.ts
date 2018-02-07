import {prepareTestKarhu} from '../test-utils'

describe('output-format-test', () => {
  describe('text', () => {
    const karhuTest = prepareTestKarhu({
      outputFormat: 'text'
    })

    it('is supported', karhuTest((karhu, output) => {
      karhu.context('test-context').info('Hello', {a: {b: 1}}, [1, 2, 3])
      expect(output.tracked).toMatchSnapshot()
    }))
  })

  describe('json', () => {
    const karhuTest = prepareTestKarhu({
      outputFormat: 'json'
    })

    it('is supported', karhuTest((karhu, output) => {
      karhu.context('test-context').info('Hello', {a: {b: {c: {d: 1}}}}, [1, 2, 3])
      expect(output.tracked).toMatchSnapshot()
    }))

    it('handles infinite recursion', karhuTest((karhu, output) => {
      const recursive: any = {},
        another = {a: recursive}
      recursive.b = another

      karhu.context('test-context').info(recursive)
      expect(output.tracked).toMatchSnapshot()
    }))

  })
})
