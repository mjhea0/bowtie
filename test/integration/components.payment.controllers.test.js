process.env.NODE_ENV = 'test';
process.env.TRANSACTION_AMOUNT = '10.00';

const chai = require('chai');
const should = chai.should();
const braintree = require(
  '../../src/server/components/payment/payment.controllers');

describe('payment : braintree', function() {

  describe('getClientToken()', function () {
    it('should provide a token', function (done) {
      braintree.getClientToken(function(err, token) {
        token.should.be.a('string');
        done();
      });
    });
  });

  describe('createTransaction()', function () {
    const nonce = 'fake-valid-nonce';
    it('should provide transaction info', function (done) {
      braintree.createTransaction(nonce, function(err, res) {
        res.should.be.a('object');
        res.success.should.equal(true);
        done();
      });
    });
  });

});
