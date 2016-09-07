(function() {

  'use strict';

  process.env.NODE_ENV = 'test';

  const passportStub = require('passport-stub');

  const userQueries = require('../src/server/db/queries.users');

  function authenticateActiveUser(done) {
    userQueries.getSingleUserByEmail('ad@min.com')
    .then(function(user) {
      passportStub.login(user[0]);
      done();
    });
  }

  module.exports = {
    authenticateActiveUser
  };

}());
