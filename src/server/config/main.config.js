(function(appConfig) {

  'use strict';

  // *** main dependencies *** //
  const path = require('path');
  const cookieParser = require('cookie-parser');
  const bodyParser = require('body-parser');
  const session = require('express-session');
  const flash = require('connect-flash');
  const morgan = require('morgan');
  const nunjucks = require('nunjucks');
  const passport = require('passport');

  // *** view folders *** //
  const viewFolders = [
    path.join(__dirname, '..', 'views'),
    path.join(__dirname, '..', 'components', 'common', 'views'),
    path.join(__dirname, '..', 'components', 'payment', 'views'),
    path.join(__dirname, '..', 'components', 'auth', 'views'),
    path.join(__dirname, '..', 'components', 'admin', 'views')
  ];

  // *** load environment variables *** //
  require('dotenv').config();

  appConfig.init = function(app, express) {

    // *** view engine *** //
    nunjucks.configure(viewFolders, {
      express: app,
      autoescape: true
    });
    app.set('view engine', 'html');

    // *** config middleware *** //
    if (process.env.NODE_ENV !== 'test') {
      app.use(morgan('dev'));
    }
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(express.static(path.join(__dirname, '..', '..', 'client')));

    app.use((req, res, next) => {
      res.locals.flashMessages = req.flash('messages');
      next();
    });

  };

})(module.exports);
