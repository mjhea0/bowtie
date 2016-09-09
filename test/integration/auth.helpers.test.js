(function() {

  'use strict';

  process.env.NODE_ENV = 'test';

  const chai = require('chai');
  const should = chai.should();

  const knex = require('../../src/server/db/knex');
  const authHelpers = require('../../src/server/auth/helpers');

  describe('auth : helpers', () => {

    beforeEach((done) => {
      knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
        .then(() => {
          return knex.seed.run()
          .then(() => {
            done();
          });
        });
      });
    });

    afterEach((done) => {
      knex.migrate.rollback()
      .then(() => {
        done();
      });
    });

    describe('authCallback()', () => {
      it('should return a user', (done) => {
        const requestObject = {
          flash: function _flash() {}
        };
        authHelpers.authCallback(
        requestObject, 'ad@min.com', 'admin',
        (error, success) => {
          should.not.exist(error);
          should.exist(success);
          success.should.contain.keys(
            'id', 'email', 'password', 'admin', 'created_at'
          );
          done();
        });
      });
      it('should not return a user if the password is incorrect',
      (done) => {
        const requestObject = {
          flash: function _flash() {}
        };
        authHelpers.authCallback(
        requestObject, 'ad@min.com', 'not correct',
        (error, success) => {
          should.not.exist(error);
          success.should.eql(false);
          done();
        });
      });
      it('should not return a user if the email is incorrect',
      (done) => {
        const requestObject = {
          flash: function _flash() {}
        };
        authHelpers.authCallback(
        requestObject, 'not correct', 'admin',
        (error, success) => {
          should.not.exist(error);
          success.should.eql(false);
          done();
        });
      });
      it('should throw an error',
      (done) => {
        knex.migrate.rollback()
        .then(() => {
          const requestObject = {
            flash: function _flash() {}
          };
          authHelpers.authCallback(
            requestObject, 'ad@min.com', 'admin',
            (error, success) => {
            should.exist(error);
            should.not.exist(success);
            done();
          });
        });
      });
    });

  });

}());
