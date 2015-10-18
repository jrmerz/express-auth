

var setup = require('./lib/setup');
var authorization = require('./lib/models/authorization');
var authentication = require('./lib/controllers/authentication');
var admin = require('./lib/controllers/admin');
var account = require('./lib/controllers/account');

module.exports = function(authSetup) {

  // you can turn this off via bodyParserInstalled flag
  if( !authSetup.bodyParserInstalled ) {
    var bodyParser = require('body-parser');
    // parse application/x-www-form-urlencoded
    authSetup.app.use(bodyParser.urlencoded({ extended: true }));
    // parse application/json
    authSetup.app.use(bodyParser.json());
  }

  setup.init(authSetup);

  // init the authentication (passport)
  authentication();

  // init the authorization (acl)
  authorization();

  // init the admin functionality
  admin();

  // setup account endpoints
  account();

  return setup;
};
