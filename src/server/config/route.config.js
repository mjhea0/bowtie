(function (routeConfig) {

  routeConfig.init = function (app) {

    // *** routes *** //
    var routes = require('../components/payment/payment.routes');

    // *** register routes *** //
    app.use('/', routes);

  };

})(module.exports);
