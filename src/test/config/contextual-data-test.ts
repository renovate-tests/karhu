import {prepareTestKarhu} from '../test-utils'

describe('correlation-id-test', () => {
    describe('contextual data string', () => {
        it('includes correlation id in text output, if available', prepareTestKarhu({
            outputFormat: 'text',
            getContextualData: () => 'testId'
        })((karhu, output) => {
            karhu.context('cid-test').info('this is a simple test')
            expect(output.tracked).toMatchSnapshot()
        }))

        it('includes correlation id in json output, if available', prepareTestKarhu({
            outputFormat: 'json',
            getContextualData: () => 'testId'
        })((karhu, output) => {
            karhu.context('cid-test').info({key: 'test-value'})
            expect(output.tracked).toMatchSnapshot()
        }))
    })

    describe('contextual data object', () => {
        it('includes correlation id in text output, if available', prepareTestKarhu({
            outputFormat: 'text',
            getContextualData: () => ({testValue: 'myString', anotherTestValue: '123'})
        })((karhu, output) => {
            karhu.context('cid-test').info('this is a simple test')
            expect(output.tracked).toMatchSnapshot()
        }))

        it('includes correlation id in json output, if available', prepareTestKarhu({
            outputFormat: 'json',
            getContextualData: () => ({testValue: 'alpha', another: 'beta'})
        })((karhu, output) => {
            karhu.context('cid-test').info({key: 'test-value'})
            expect(output.tracked).toMatchSnapshot()
        }))
    })
})
