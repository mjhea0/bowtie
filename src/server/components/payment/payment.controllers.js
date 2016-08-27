(function() {

  'use strict';

  const nodemailer = require('nodemailer');
  const mg = require('nodemailer-mailgun-transport');

  const transactionAmount = process.env.TRANSACTION_AMOUNT;
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

  function createTransaction(nonce, callback) {
    gateway.transaction.sale({
      amount: transactionAmount,
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

    const nodemailerMailgun = nodemailer.createTransport(mg(auth));

    const message = {
      from: 'bow@tie.com',
      to: userEmail,
      subject: 'Bowtie!', //
      text: 'Hello!',
      html: 'Hello!'
    };

    nodemailerMailgun.sendMail(message, function (error, info) {
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
