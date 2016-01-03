var authorization = require('./lib/models/authorization');
var authentication = require('./lib/controllers/authentication');
var middleware;

//var admin = require('./lib/controllers/admin');

var auth = {
  init : function(setup) {
    checkSetupErrors(setup);

    // see if we were passed a reference to a config file
    if( typeof setup.config === 'string' ) {
      setup.config = require(setup.config);
    }
    var config = setup.config;
    var app = setup.app;
    var db = setup.db;

    // you can turn this off via installRequiredMiddleware flag
    if( config.installRequiredMiddleware ) {
      var cookieParser = require('cookie-parser');
      app.use(cookieParser());

      var bodyParser = require('body-parser');
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());
    }

    // set default path if not provided
    config.path = config.path || '/auth';

    config.usersCollection = db.collection(config.usersCollection || 'users');

    // init the authentication (gitkit)
    authentication(setup);

    // init the authorization (acl)
    authorization(setup, auth);

    // init the admin functionality
    //admin();

    // add middleware to express
    middleware = require('./lib/auth-middleware')(setup);
    app.use(middleware);

  },
  middleware : middleware
};

function checkSetupErrors(setup) {
  if( !setup.app ) {
    throw('ExpressAuth setup requires express "app"');
  }
  if( !setup.db ) {
    throw('ExpressAuth setup requires MongoDB "db"');
  }
  if( !setup.config ) {
    throw('ExpressAuth setup requires "config"');
  }
}

module.exports = auth;
