(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** routes *** //
    const routes = require('../components/payment/payment.routes');
    const authRoutes = require('../components/auth/auth.routes');
    const adminRoutes = require('../components/admin/admin.routes');

    // *** register routes *** //
    app.use('/', routes);
    app.use('/auth', authRoutes);
    app.use('/admin', adminRoutes);

  };

})(module.exports);
