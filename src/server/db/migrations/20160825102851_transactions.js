exports.up = (knex, Promise) => {
  return knex.schema.createTable('transactions', (table) => {
    table.increments();
    table.string('email').notNullable();
    table.boolean('purchased').notNullable().defaultTo(true);
    table.string('transaction_id').unique().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('transactions');
};
