(function() {

  'use strict';

  const express = require('express');
  const router = express.Router();

  const braintree = require('./payment.controllers');

  let paid = false;
  const transactionAmount = process.env.TRANSACTION_AMOUNT;

  router.get('/', indexHandler);
  router.post('/checkout', checkoutHandler);
  router.get('/thanks', thanksHandler);

  function indexHandler(req, res, next) {
    const renderObject = {};
    renderObject.title = 'Bowtie - digital downloads made easy';
    braintree.getClientToken((err, token) => {
      if (err) {
        return next(err);
      }
      renderObject.token = token;
      return res.render('payment', renderObject);
    });
  }

  function checkoutHandler(req, res, next) {
    const nonce = req.body.payment_method_nonce;
    const userEmail = req.body.email;
    // ensure email is unique
    braintree.checkEmail(userEmail, (err, data) => {
      if (data.length) {
        return res.status(500).json({
          status: 'That email has already been used.',
          data: null
        });
      }
      // create braintree transaction
      braintree.createTransaction(
        parseFloat(transactionAmount), nonce, (err, data) => {
        if (err) {
          return next(err);
        }
        if (data.success || data.transaction) {
          const transactionID = data.transaction.id;
          // add user to the db
          braintree.createUser(
            transactionID, userEmail, (err, user) => {
            if (err) {
              return next(err);
            }
            // send email
            braintree.sendEmail(userEmail, (err, info) => {
              if (err) {
                return next(err);
              }
              paid = true;
              return res.status(200).json({
                status: 'success',
                data: user
              });
            });
          });
        } else {
          return res.status(500).json({
            status: 'error'
          });
        }
      });
    });
  }

  function thanksHandler(req, res, next) {
    if (paid) {
      const renderObject = {};
      renderObject.title = 'Thank you!';
      return res.render('thanks', renderObject);
    } else {
      res.redirect('/');
    }
  }

  module.exports = router;

}());
