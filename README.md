# Bowtie

Have a digital product that you want to sell? Bowtie simplifies the process, providing both the client and server-side code, and is powered by JavaScript, Node, Express, Postgres, Braintree, and Mailgun.

## Getting Started

1. Fork/Clone
1. Install dependecies - `npm install`
1. Set up a [Sandbox](https://sandbox.braintreegateway.com) on [Braintree](https://www.braintreepayments.com/)
1. Copy *.env-sample* to *.env* and then update.
1. Create local database - i.e., `createdb bowtie`
1. Migrate - `knex migrate:latest --env development`
1. Run the development server - `npm start`
