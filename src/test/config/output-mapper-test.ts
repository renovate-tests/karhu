import {prepareTestKarhu} from '../test-utils'

describe('output-mapper-test', () => {
  describe('it is applied', () => {
    const karhuTest = prepareTestKarhu({
      outputMapper: val => val * 2
    })

    it('is applied to the first parameter', karhuTest((karhu, output) => {
      karhu.context('ctx').error(10000 / 2)
      expect(output.tracked).toMatchSnapshot()
    }))

    it('is applied to all parameters', karhuTest((karhu, output) => {
      karhu.context('ctx').error(1, 2, 3, 4, 5, 6)
      expect(output.tracked).toMatchSnapshot()
    }))
  })

  describe('args', () => {
    const args: any[] = []

    const karhuTest = prepareTestKarhu({
      outputMapper: (...argsImpl: any[]) => {
        args.push(argsImpl)
        return 'Overridden'
      }
    })

    it('is called with the right arguments', karhuTest((karhu) => {
      karhu.context('test-context').warn('Hello', 1, {a: 1})
      expect(args).toMatchSnapshot()
    }))
  })

  describe('transport', () => {
    const karhuTest = prepareTestKarhu({
        outputMapper: val => val * 2
      },
      {
        outputMapper: val => val + 10
      }
    )

    it('can provide its own mapper', karhuTest((karhu, output) => {
      karhu.context('ctx').error(5)
      expect(output.tracked).toMatchSnapshot()
    }))
  })
})
