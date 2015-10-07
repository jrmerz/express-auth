var session = require('express-session');
var passport = require('passport');

// setup = config, app, db, passport
// if using oauth: oauthNoUser callback needs to be provided as well
function init(setup) {
  setup.passport = passport;

  passport.serializeUser(function(user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(function(id, done) {
    setup.usersCollection.findOne({username : id}, {oauth: 0, local: 0}, done);
  });

  // init the middleware stack for passport
  setup.app.use(session({
    secret: setup.config.sessionSecret,
    resave: false,
    saveUninitialized: true
  }));
  setup.app.use(passport.initialize());
  setup.app.use(passport.session());

  require('./router')(setup);
  require('./setup')(setup);
}

module.exports = {
  init : init
};
