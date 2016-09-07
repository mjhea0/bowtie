const bcrypt = require('bcryptjs');

exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
  .then(() => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync('admin', salt);
    return Promise.all([
      // Inserts seed entries
      knex('users').insert({
        email: 'ad@min.com',
        password: hash,
        admin: true
      })
    ]);
  });
};
