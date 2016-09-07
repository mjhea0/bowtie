exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', (table)=> {
    table.increments();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.boolean('admin').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
