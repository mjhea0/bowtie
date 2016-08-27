# Bowtie

[![Build Status](https://travis-ci.org/mjhea0/bowtie.svg?branch=master)](https://travis-ci.org/mjhea0/bowtie)

Have a digital product that you want to sell? Bowtie simplifies the process, providing both the client and server-side code. It's powered by JavaScript, Node, Express, Postgres, [Braintree](https://www.braintreepayments.com/) (for payment processing), and [Mailgun](http://www.mailgun.com).

## Getting Started

1. Fork/Clone
1. Install dependecies - `npm install`
1. Set up a [Sandbox](https://sandbox.braintreegateway.com) on [Braintree](https://www.braintreepayments.com/)
1. Copy *.env-sample* to *.env* and then update.
1. Create local database - i.e., `createdb bowtie`
1. Migrate - `knex migrate:latest --env development`
1. Run the development server - `npm start`

## Test

1. Without coverage - `npm test`
1. With coverahe - `npm run coverage`

## TODO

1. Add Code Coverage
1. Add more tests
1. Update UI/UX
1. Add different mail providers for Nodemailer
1. Update documentation
