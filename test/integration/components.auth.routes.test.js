(function() {

  'use strict';

  process.env.NODE_ENV = 'test';

  const chai = require('chai');
  const chaiHttp = require('chai-http');
  const passportStub = require('passport-stub');
  const should = chai.should();

  const knex = require('../../src/server/db/knex');
  const app = require('../../src/server/app');
  const testHelpers = require('../helpers');

  chai.use(chaiHttp);
  passportStub.install(app);

  describe('components : auth : routes', () => {

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

    describe('If Unauthenticated', () => {

      describe('GET /auth/login', () => {
        it('should render the login view', (done) => {
          chai.request(app)
          .get('/auth/login')
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.eql(0);
            res.status.should.eql(200);
            res.type.should.eql('text/html');
            res.text.should.contain('<h1>Login</h1>');
            done();
          });
        });
      });

      describe('POST /auth/login', () => {
        it('should return a 200 status code', (done) => {
          chai.request(app)
          .post('/auth/login')
          .send({
            email: 'ad@min.com',
            password: 'admin'
          })
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            res.type.should.eql('text/html');
            done();
          });
        });
        it('should redirect to the admin view if the password is incorrect', (done) => {
          chai.request(app)
          .post('/auth/login')
          .send({
            email: 'ad@min.com',
            password: 'badpassword'
          })
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            res.type.should.eql('text/html');
            res.text.should.contain('<h1>Login</h1>');
            done();
          });
        });
        it('should redirect to the admin view if the email address is incorrect', (done) => {
          chai.request(app)
          .post('/auth/login')
          .send({
            email: 'bad@email.com',
            password: 'admin'
          })
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(200);
            res.type.should.eql('text/html');
            res.text.should.contain('<h1>Login</h1>');
            done();
          });
        });
      });

      describe('GET /auth/logout', () => {
        it('should redirect to the login view', (done) => {
          chai.request(app)
          .get('/auth/logout')
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.eql(1);
            res.status.should.eql(200);
            res.type.should.eql('text/html');
            res.text.should.contain('<h1>Login</h1>');
            done();
          });
        });
      });

    });

    describe('If Authenticated', () => {

      beforeEach((done) => {
        passportStub.logout();
        testHelpers.authenticateActiveUser(done);
      });
      afterEach((done) => {
        passportStub.logout();
        done();
      });

      describe('GET /auth/login', () => {
        it('should redirect to the admin view if a user is already logged in', (done) => {
          chai.request(app)
          .get('/auth/login')
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.eql(1);
            res.status.should.eql(200);
            res.type.should.eql('text/html');
            res.text.should.contain('<p>Hello!</p>');
            done();
          });
        });
      });

      describe('POST /auth/login', () => {
        it('should redirect to the admin view', (done) => {
          chai.request(app)
          .post('/auth/login')
          .send({
            email: 'ad@min.com',
            password: 'admin'
          })
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.eql(1);
            res.status.should.eql(200);
            res.type.should.eql('text/html');
            res.text.should.contain('<p>Hello!</p>');
            done();
          });
        });
      });

      describe('GET /auth/logout', () => {
        beforeEach((done) => {
          passportStub.logout();
          testHelpers.authenticateActiveUser(done);
        });
        afterEach((done) => {
          passportStub.logout();
          done();
        });
        it('should redirect to the admin view', (done) => {
          chai.request(app)
          .get('/auth/logout')
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.eql(1);
            res.status.should.eql(200);
            res.type.should.eql('text/html');
            res.text.should.contain('<h1>Login</h1>');
            done();
          });
        });
      });
    });

  });

}());
