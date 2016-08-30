process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();

const knex = require('../../src/server/db/knex');
const braintree = require(
  '../../src/server/components/payment/payment.controllers');

describe('components : payment : payment.controllers', () => {

  beforeEach((done) => {
    knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
      .then(() => {
        done();
      });
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(() => {
      done();
    });
  });

  describe('getClientToken()', () => {
    it('should provide a token', (done) => {
      braintree.getClientToken((err, token) => {
        should.not.exist(err);
        should.exist(token);
        token.should.be.a('string');
        done();
      });
    });
  });

  describe('createTransaction()', () => {
    it('should create a transaction', (done) => {
      const nonce = 'fake-valid-nonce';
      const transactionAmount = '20.00';
      braintree.createTransaction(
        transactionAmount, nonce, (err, info) => {
        should.not.exist(err);
        should.not.exist(info.errors);
        should.exist(info.transaction);
        info.should.be.a('object');
        info.transaction.id.should.be.a('string');
        const amount = parseFloat(info.transaction.amount).toFixed(2);
        amount.should.eql(transactionAmount);
        info.success.should.eql(true);
        done();
      });
    });
    it('should NOT create a transaction when the nonce is invalid',
      (done) => {
      const nonce = 'invalid nonce';
      const transactionAmount = '20.00';
      braintree.createTransaction(
        transactionAmount, nonce, (err, info) => {
        should.not.exist(err);
        info.should.be.a('object');
        should.exist(info.errors);
        should.not.exist(info.transaction);
        info.params.transaction.paymentMethodNonce.should.eql(
          'invalid nonce');
        info.message.should.eql(
          'Unknown or expired payment_method_nonce.');
        info.success.should.eql(false);
        done();
      });
    });
    it('should NOT create a transaction when the amount is null',
      (done) => {
      const nonce = 'fake-valid-nonce';
      const transactionAmount = null;
      braintree.createTransaction(
        transactionAmount, nonce, (err, info) => {
        should.not.exist(err);
        info.should.be.a('object');
        should.exist(info.errors);
        should.not.exist(info.transaction);
        info.should.be.a('object');
        should.not.exist(info.params.transaction.amount);
        info.message.should.eql('Amount is required.');
        info.success.should.eql(false);
        done();
      });
    });
  });

  describe('createUser()', () => {
    it('should create a user', (done) => {
      const transactionID = '9999';
      const userEmail = 'test@test.com';
      braintree.createUser(
        transactionID, userEmail, (err, userInfo) => {
        should.not.exist(err);
        userInfo.should.be.a('array');
        userInfo[0].email.should.eql('test@test.com');
        done();
      });
    });
    it('should NOT create a user if the email is already in use',
      (done) => {
      const transactionID = '99999';
      const userEmail = 'testing@testing.com';
      braintree.createUser(
        transactionID, userEmail, (err, userInfo) => {
        should.not.exist(err);
        userInfo.should.be.a('array');
        userInfo[0].email.should.eql('testing@testing.com');
        braintree.createUser(
          transactionID, userEmail, (err, userInfo) => {
          should.exist(err);
          should.not.exist(userInfo);
          done();
        });
      });
    });
  });

  describe('checkEmail()', () => {
    it('should return an empty array', (done) => {
      const userEmail = 'test@test.com';
      braintree.checkEmail(userEmail, (err, user) => {
        should.not.exist(err);
        user.should.be.a('array');
        user.length.should.eql(0);
        done();
      });
    });
  });

  describe('sendEmail()', () => {
    it('should send an email', (done) => {
      const userEmail = 'test@test.com';
      braintree.sendEmail(userEmail, (err, info) => {
        should.not.exist(err);
        const msg = info.response.toString();
        msg.should.contain('From: bow@tie.com');
        msg.should.contain('To: test@test.com');
        msg.should.contain('Subject: Bowtie!');
        msg.should.contain('Hello!');
        done();
      });
    });
  });

});
