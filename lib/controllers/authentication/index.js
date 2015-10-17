var setup = require('../../setup');
var session = require('express-session');
var passport = require('passport');

var router = require('./router');
var init = require('./init');

var model = require('../models/authentication');

// setup = config, app, db, passport
// if using oauth: oauthNoUser callback needs to be provided as well
module.exports = function() {
  setup.setPassport(passport);

  passport.serializeUser(function(user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(function(id, done) {
    setup.collection('users').findOne({username : id}, {oauth: 0, local: 0}, done);
  });

  // init the middleware stack for express
  setup.app().use(session({
    secret: setup.config().sessionSecret,
    resave: false,
    saveUninitialized: true
  }));
  setup.app().use(passport.initialize());
  setup.app().use(passport.session());

  router(model);
  init(model);
};
