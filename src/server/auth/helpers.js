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
        return done(null, false, message);
      }
      if (!comparePass(password, user[0].password)) {
        let message = req.flash('messages', {
          status: 'danger',
          value: 'Incorrect credentials.'
        });
        return done(null, false, message);
      } else {
        return done(null, user[0]);
      }
    }).catch((err) => {
      return done(err);
    });
  }

  function createUser(req) {
    return handleErrors(req)
    .then(() => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(req.body.user.password, salt);
      return knex('users').insert({
        username: req.body.username,
        password: hash
      }, '*');
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

  function handleErrors(req) {
    return new Promise((resolve, reject) => {
      if (req.body.email.length < 6) {
        reject({
          err: 'username_length',
          message:'Username must be longer than 6 characters'
        });
      } else if (req.body.password.length < 6) {
        reject({
          err: 'password_length',
          message:'Password must be longer than 6 characters'
        });
      }
      else {
        resolve();
      }
    });
  }

  module.exports = {
    authCallback,
    comparePass,
    checkAuthentication,
    checkAdmin,
    preventLoginSignup
  };

}());
