var setup = require('./lib/setup');
var authorization = require('./lib/models/authorization');
var authentication = require('./lib/controllers/authentication');
var admin = require('./lib/controllers/admin');

module.exports = function(authSetup) {
  setup.init(authSetup);

  // init the authentication (passport)
  authentication();

  // init the authorization (acl)
  authorization();

  // init the admin functionality
  admin();
};
