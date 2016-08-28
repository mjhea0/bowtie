process.env.NODE_ENV = 'test';
process.env.TRANSACTION_AMOUNT = '10.00';

const chai = require('chai');
const should = chai.should();

const knex = require('../../src/server/db/knex');
const braintree = require(
  '../../src/server/components/payment/payment.controllers');

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
        should.exist(token);
        token.should.be.a('string');
        done();
      });
    });
  });

  describe('createTransaction()', function () {
    it('should provide transaction info', function (done) {
      const nonce = 'fake-valid-nonce';
      braintree.createTransaction(nonce,
        function(err, transactionInfo) {
        transactionInfo.should.be.a('object');
        transactionInfo.transaction.id.should.be.a('string');
        transactionInfo.success.should.equal(true);
        done();
      });
    });
    it('should NOT provide transaction info when the nonce is invalid',
      function (done) {
      const nonce = 'invalid nonce';
      braintree.createTransaction(nonce,
        function(err, transactionInfo) {
        transactionInfo.should.be.a('object');
        transactionInfo.params.transaction
          .paymentMethodNonce.should.eql('invalid nonce');
        transactionInfo.message.should.eql(
          'Unknown or expired payment_method_nonce.');
        transactionInfo.success.should.equal(false);
        done();
      });
    });
  });

  describe('createUser()', function () {
    it('should create a user', function (done) {
      const transactionID = '9999';
      const userEmail = 'test@test.com';
      braintree.createUser(
        transactionID, userEmail, function(err, userInfo) {
        userInfo.should.be.a('array');
        userInfo[0].email.should.eql('test@test.com');
        done();
      });
    });
    it('should NOT create a user if the email is already in use',
      function (done) {
      const transactionID = '99999';
      const userEmail = 'testing@testing.com';
      braintree.createUser(
        transactionID, userEmail, function(err, userInfo) {
        userInfo.should.be.a('array');
        userInfo[0].email.should.eql('testing@testing.com');
        braintree.createUser(
          transactionID, userEmail, function(err, userInfo) {
          should.exist(err);
          should.not.exist(userInfo);
          done();
        });
      });
    });
  });

  describe('checkEmail()', function () {
    it('should return an empty array', function (done) {
      const userEmail = 'test@test.com';
      braintree.checkEmail(userEmail, function(err, user) {
        user.should.be.a('array');
        user.length.should.eql(0);
        done();
      });
    });
  });

});
