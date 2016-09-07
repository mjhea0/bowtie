process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const knex = require('../../src/server/db/knex');
const app = require('../../src/server/app');

chai.use(chaiHttp);

describe('components : payment : routes', () => {

  beforeEach((done) => {
    knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
      .then(() => {
        done();
      });
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(() => {
      done();
    });
  });

  describe('GET /', () => {
    it('should render the payment view', (done) => {
      chai.request(app)
      .get('/')
      .end((err, res) => {
        should.not.exist(err);
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('text/html');
        res.text.should.contain('<h1>Welcome!</h1>');
        done();
      });
    });
  });

  describe('POST /checkout', () => {
    it('should return a valid response', (done) => {
      chai.request(app)
      .post('/checkout')
      .send({
        email: 'test@test.com',
        payment_method_nonce: 'fake-valid-nonce'
      })
      .end((err, res) => {
        console.log(err);
        should.not.exist(err);
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(1);
        res.body.data[0].should.include.keys(
          'id',
          'email',
          'purchased',
          'transaction_id',
          'created_at'
        );
        res.body.data[0].email.should.eql('test@test.com');
        res.body.data[0].purchased.should.eql(true);
        done();
      });
    });
  });

});
