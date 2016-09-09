(function() {

  'use strict';

  const bcrypt = require('bcryptjs');

  const knex = require('../db/knex');
  const userQueries = require('../db/queries.users');

  function authCallback(req, email, password, done) {
    userQueries.getSingleUserByEmail(email)
    .then((user) => {
      if (!user.length) {
        let message = req.flash('messages', {
          status: 'danger',
          value: 'Incorrect credentials.'
        });
        return done(null, false);
      }
      if (!comparePass(password, user[0].password)) {
        let message = req.flash('messages', {
          status: 'danger',
          value: 'Incorrect credentials.'
        });
        return done(null, false);
      } else {
        return done(null, user[0]);
      }
    }).catch((err) => {
      return done(err);
    });
  }

  function checkAuthentication(req, res, next) {
    if (!req.user) {
      req.flash('messages', {
        status: 'danger',
        value: 'Please log in.'
      });
      return res.redirect('/auth/login');
    } else {
      return next();
    }
  }

  function checkAdmin(req, res, next) {
    if (!req.user) {
      req.flash('messages', {
        status: 'danger',
        value: 'Please log in.'
      });
      return res.redirect('/auth/login');
    } else {
      if (!req.user.admin) {
        req.flash('messages', {
          status: 'danger',
          value: 'Please log in.'
        });
        return res.redirect('/auth/login');
      } else {
        return next();
      }
    }
  }

  function preventLoginSignup(req, res, next) {
    if (req.user) {
      return res.redirect('/admin');
    } else {
      return next();
    }
  }

  // *** helper functions *** //

  function comparePass(userpass, dbpass) {
    return bcrypt.compareSync(userpass, dbpass);
  }

  module.exports = {
    authCallback,
    comparePass,
    checkAuthentication,
    checkAdmin,
    preventLoginSignup
  };

}());
