(function() {

  'use strict';

  const nodemailer = require('nodemailer');
  const ses = require('nodemailer-ses-transport');
  const stubTransport = require('nodemailer-stub-transport');

  const amazonAccessKeyID = process.env.AMAZON_KEY_ID;
  const amazonSecretAccessKey = process.env.AMAZON_KEY_SECRET;
  const amazonRateLimit = process.env.AMAZON_RATE_LIMIT;
  const amazonRegion = process.env.AMAZON_REGION;

  const gateway = require('../../config/payment.config');
  const knex = require('../../db/knex');

  function getClientToken(callback) {
    gateway.clientToken.generate({}, (err, response) => {
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
    (err, result) => {
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
    .then((res) => {
      callback(null, res);
    })
    .catch((err) => {
      callback(err);
    });
  }

  function checkEmail(userEmail, callback) {
    return knex('users')
    .select('*')
    .where('email', userEmail)
    .then((res) => {
      callback(null, res);
    })
    .catch((err) => {
      callback(err);
    });
  }

  function sendEmail(userEmail, callback) {

    const auth = {
      accessKeyId: amazonAccessKeyID,
      secretAccessKey: amazonSecretAccessKey,
      rateLimit: amazonRateLimit,
      region: amazonRegion
    };

    let transporter;

    if (process.env.NODE_ENV !== 'test') {
      transporter = nodemailer.createTransport(ses(auth));
    } else {
      transporter = nodemailer.createTransport(stubTransport());
    }

    const message = {
      from: 'hermanmu@gmail.com',
      to: userEmail,
      subject: 'Bowtie!',
      text: 'Hello!',
      html: 'Hello!'
    };

    transporter.sendMail(message, (error, info) => {
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
