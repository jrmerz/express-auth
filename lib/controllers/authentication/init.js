var setup = require('../../setup');
var utils = require('./utils');
var uuid = require('uuid');

var LocalStrategy, GoogleStrategy;
var collection, config;

/**
 * Setup should contain:
 *
 * config, app, db, passport, oauthNoUser
 **/
module.exports = function(model) {
  config = setup.config();
  collection = setup.collection('users');

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
};

function setupGoogle() {
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  model.importGoogle();

  setup.passport.use(
    new GoogleStrategy({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.url + config.path + '/google/callback'
    },
    model.google().login)
  );
}

function setupLocal() {
  LocalStrategy = require('passport-local').Strategy;
  model.importLocal();

  setup.passport().use(
    new LocalStrategy(model.local().login)
  );
}
