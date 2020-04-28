import {prepareTestKarhu} from '../test-utils'

describe('correlation-id-test', () => {
    it('includes correlation id in text output, if available', prepareTestKarhu({
        outputFormat: 'text',
        getCorrelationId: () => 'testId'
    })((karhu, output) => {
        karhu.context('cid-test').info('this is a simple test')
        expect(output.tracked).toMatchSnapshot()
    }))

    it('includes correlation id in json output, if available', prepareTestKarhu({
        outputFormat: 'json',
        getCorrelationId: () => 'testId'
    })((karhu, output) => {
        karhu.context('cid-test').info({key: 'test-value'})
        expect(output.tracked).toMatchSnapshot()
    }))
})
