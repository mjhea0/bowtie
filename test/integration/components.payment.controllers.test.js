process.env.NODE_ENV = 'test';
process.env.TRANSACTION_AMOUNT = '10.00';

const chai = require('chai');
const should = chai.should();

const knex = require('../../src/server/db/knex');
const braintree = require(
  '../../src/server/components/payment/payment.controllers');

// TODO: Test for errors
describe('components : payment : payment.controllers', function() {

  beforeEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      knex.migrate.latest()
      .then(function() {
        done();
      });
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      done();
    });
  });

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
      braintree.createTransaction(nonce, function(err, transactionInfo) {
        transactionInfo.should.be.a('object');
        transactionInfo.transaction.id.should.be.a('string');
        transactionInfo.success.should.equal(true);
        done();
      });
    });
  });

  describe('createUser()', function () {
    const transactionID = '9999';
    const userEmail = 'test@test.com';
    it('should create a user', function (done) {
      braintree.createUser(
        transactionID, userEmail, function(err, userInfo) {
        userInfo.should.be.a('array');
        userInfo[0].email.should.eql('test@test.com');
        done();
      });
    });
  });

});
