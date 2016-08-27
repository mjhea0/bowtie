(function (errorConfig) {

  'use strict';

  // *** error handling *** //

  errorConfig.init = function (app) {

    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.customMessage = 'Sorry. That page cannot be found.';
      err.status = 404;
      next(err);
    });

    app.use(function(err, req, res, next) {
      console.log(err);
      res.status(err.status || 500);
      res.render('error', {
        message: err.customMessage || 'Something went wrong!',
        error: {}
      });
    });

  };

})(module.exports);
