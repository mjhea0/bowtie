# Bowtie

[![Build Status](https://travis-ci.org/mjhea0/bowtie.svg?branch=master)](https://travis-ci.org/mjhea0/bowtie)
[![Coverage Status](https://coveralls.io/repos/github/mjhea0/bowtie/badge.svg?branch=master)](https://coveralls.io/github/mjhea0/bowtie?branch=master)

Have a digital product that you want to sell? Bowtie simplifies the process, providing both the client and server code. It's powered by -

1. HTML
1. CSS
1. JavaScript/jQuery
1. NodeJS
1. ExpressJS
1. Postgres
1. [Braintree](https://www.braintreepayments.com/) (for payment processing)
1. [Amazon SES](https://aws.amazon.com/ses/) (for transactional emails)

## Getting Started

1. Fork/Clone
1. Install dependecies - `npm install`
1. Set up a [Sandbox](https://sandbox.braintreegateway.com) on [Braintree](https://www.braintreepayments.com/)
1. Set up an account on Amazon AWS (make sure the keys do not have any [special symbols](https://github.com/andris9/nodemailer-ses-transport#warning-about-aws-tokens)) and verify a valid email address on [Amazon SES](https://aws.amazon.com/ses/).
1. Copy *.env-sample* to *.env* and then update.
1. Create local database - i.e., `createdb bowtie`
1. Migrate - `knex migrate:latest --env development`
1. Seed - `knex seed:run --env development`
1. Run the development server - `gulp`

## Test

1. Create local test database - i.e., `createdb bowtie_test`
1. Without coverage - `npm test`
1. With coverage - `npm run coverage`

## TODO

1. Handle errors better
1. Add unit tests
1. Add admin set up
1. Add admin transactions
1. Update UI/UX
1. Add screenshots to README
1. Refactor `paid`
1. ~~Set up Travis CI~~ (08/27/2016)
1. ~~Add Code Coverage and Coveralls~~ (08/27/2016)
1. ~~Add more integration tests~~ (08/29/2016)
1. ~~Update UI/UX~~ (08/29/2016)
1. ~~Added Amazon SES~~ (09/02/2016)
1. ~~Add gulp file~~ (09/02/2016)
1. ~~Update client side validation~~ (09/05/2016)
1. ~~Set up passport for admin~~ (09/06/2016)
1. ~~Write tests~~ (09/06/2016)
1. ~~Refactor tests~~ (09/07/2016)
1. ~~Write tests~~ (09/09/2016)
