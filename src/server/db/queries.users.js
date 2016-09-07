const knex = require('./knex');

function getSingleUserByEmail(email) {
  return knex('users')
  .select('*')
  .where('email', email)
  .returning('*');
}

module.exports = {
  getSingleUserByEmail
};
