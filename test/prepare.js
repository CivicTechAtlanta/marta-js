process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

if (!process.env.API_KEY) {
  throw new Error('To run the test suite, you need to supply the API_KEY environment variable')
}
