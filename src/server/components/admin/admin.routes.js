(function() {

  'use strict';

  const express = require('express');
  const router = express.Router();

  const authHelpers = require('../../auth/helpers');

  router.get(
    '/',
    authHelpers.checkAdmin,
    adminIndexHandler
  );

  function adminIndexHandler(req, res, next) {
    const renderObject = {};
    renderObject.title = 'Bowtie - admin zone';
    renderObject.flashMessages = res.locals.flashMessages;
    return res.render('admin', renderObject);
  }

  module.exports = router;

}());
