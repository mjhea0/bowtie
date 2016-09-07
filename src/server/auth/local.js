(function() {

  'use strict';

  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;

  const knex = require('../db/knex');
  const authHelpers = require('./helpers');

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  }, authHelpers.authCallback));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    knex('users').where('id', id)
    .then((user) => {
      done(null, user[0]);
    })
    .catch((err) => {
      done(err);
    });
  });

  module.exports = passport;

}());
