(function() {

  'use strict';

  const express = require('express');
  const router = express.Router();

  const passport = require('../../auth/local');
  const authHelpers = require('../../auth/helpers');

  router.get(
    '/login',
    authHelpers.preventLoginSignup,
    loginHandler
  );
  router.post(
    '/login',
    authHelpers.preventLoginSignup,
    passport.authenticate('local', {
      successRedirect: '/admin',
      failureRedirect: '/auth/login'
    })
  );
  router.get(
    '/logout',
    authHelpers.checkAuthentication,
    logoutHandler
  );

  function loginHandler(req, res, next) {
    const renderObject = {};
    renderObject.title = 'Bowtie - please log in';
    renderObject.flashMessages = res.locals.flashMessages;
    return res.render('login', renderObject);
  }

  function logoutHandler(req, res, next) {
    req.logout();
    return res.redirect('/auth/login');
  }

  module.exports = router;

}());
