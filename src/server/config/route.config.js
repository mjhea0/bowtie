(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** routes *** //
    const routes = require('../components/payment/payment.routes');

    // *** register routes *** //
    app.use('/', routes);

  };

})(module.exports);
