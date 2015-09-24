var LocalStrategy, GoogleStrategy;
var utils = require('./utils');
var collection, config;

/**
 * Setup should contain:
 *
 * config, app, db, passport, oauthNoUser
 **/
module.exports = function(setup) {
  config = setup.config;
  collection = setup.usersCollection;

  if( config.local ) {
    setupLocal(setup);
  }

  if( config.google ) {
    setupGoogle(setup);
  }
};

function setupGoogle(setup) {
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

  var path = config.path || '/login';

  passport.use(new GoogleStrategy({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.url + path + '/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      collection.findOne({'oauth.google.id': profile.id }, function (err, user) {
        if( err ) {
          return done(err);
        }

        // leave it to the app to handle no user creation
        if( !user ) {
          return setup.oauthNoUser(collection, accessToken, refreshToken, profile, done);
        }

        return done(err, user);
      });
    }
  ));
}

function setupLocal(config, app, db, passport) {
  LocalStrategy = require('passport-local').Strategy;

  passport.use(new LocalStrategy(
    function(username, password, done) {
      collection.findOne({ username: username }, function (err, user) {
        if( err ) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        utils.passwordsMatch(password, user.local.password, function(err, isMatch){
          if( err ) {
            return done(err);
          }
          if( !isMatch ) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          done(null, user);
        });
      });
    }
  ));
}
