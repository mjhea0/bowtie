exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('email').notNullable().unique();
    table.boolean('purchased').notNullable().defaultTo(true);
    table.string('transaction_id').unique().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
