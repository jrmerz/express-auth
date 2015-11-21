var setup = require('../../setup');
var session = require('express-session');
var passport = require('passport');

var router = require('./router');
var deserializeUser = require('./deserialize');

var model = require('../../models/authentication');

// setup = config, app, db, passport
// if using oauth: oauthNoUser callback needs to be provided as well
module.exports = function() {
  setup.setPassport(passport);

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(deserializeUser);

  // init the middleware stack for express
  var app = setup.app();
  if( app ) {
    app.use(session({
      secret: setup.config().sessionSecret,
      resave: false,
      saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
  }

  config = setup.config();
  collection = setup.collection('users');

  // now setup specific endpoints
  if( config.local ) {
    setupLocal();
  }

  if( config.google ) {
    // user passed private config file
    if( typeof config.google === 'string' ) {
      config.google = require(config.google);
    }

    setupGoogle(model);
  }


  router(model);
};

function setupGoogle() {
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  model.importGoogle();

  passport.use(
    new GoogleStrategy({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.url + config.path + '/google/callback'
    },
    model.google().login)
  );
}

function setupLocal() {
  var LocalStrategy = require('passport-local').Strategy;
  model.importLocal();

  passport.use(
    new LocalStrategy(model.local().login)
  );
}
