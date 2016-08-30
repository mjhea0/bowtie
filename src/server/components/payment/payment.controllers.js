(function() {

  'use strict';

  const nodemailer = require('nodemailer');
  const mailgunTransport = require('nodemailer-mailgun-transport');
  const stubTransport = require('nodemailer-stub-transport');

  const mailgunKey = process.env.MAILGUN_KEY;
  const mailgunDomain = process.env.MAILGUN_DOMAIN;

  const gateway = require('../../config/payment.config');
  const knex = require('../../db/knex');

  function getClientToken(callback) {
    gateway.clientToken.generate({}, function(err, response) {
      if (err) {
        callback(err);
      }
      if (response.clientToken) {
        callback(null, response.clientToken);
      } else {
        callback(null, response);
      }
    });
  }

  function createTransaction(transactionAmount, nonce, callback) {
    gateway.transaction.sale({
      amount: parseFloat(transactionAmount),
      paymentMethodNonce: nonce
    },
    function(err, result) {
      if (err) {
        callback(err);
      }
      if (result) {
        callback(null, result);
      }
    });
  }

  function createUser(transactionID, userEmail, callback) {
    return knex('users')
    .insert({
      email: userEmail,
      transaction_id: transactionID
    })
    .returning('*')
    .then(function(res) {
      callback(null, res);
    })
    .catch(function(err) {
      callback(err);
    });
  }

  function checkEmail(userEmail, callback) {
    return knex('users')
    .select('*')
    .where('email', userEmail)
    .then(function(res) {
      callback(null, res);
    })
    .catch(function(err) {
      callback(err);
    });
  }

  function sendEmail(userEmail, callback) {

    const auth = {
      auth: {
        api_key: mailgunKey,
        domain: mailgunDomain
      }
    };

    let transport;

    if (process.env.NODE_ENV !== 'test') {
      transport = nodemailer.createTransport(mailgunTransport(auth));
    } else {
      transport = nodemailer.createTransport(stubTransport());
    }

    const message = {
      from: 'bow@tie.com',
      to: userEmail,
      subject: 'Bowtie!',
      text: 'Hello!',
      html: 'Hello!'
    };

    transport.sendMail(message, function (error, info) {
      if (error) {
        callback(error);
      }
      if (info) {
        callback(null, info);
      }
    });

  }

  module.exports = {
    getClientToken,
    createTransaction,
    createUser,
    checkEmail,
    sendEmail
  };

}());
