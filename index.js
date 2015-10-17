var setup = require('./lib/setup');
var authorization = require('./lib/models/authorization');
var authentication = require('./lib/controllers/authentication');

module.exports = function(setup) {
  setup.init(setup);

  // init the authentication (passport)
  authentication.init(setup);

  // init the authorization (acl)
  authorization.init(setup);

  // init the admin functionality
  require('./lib/controllers/admin')(setup);
}
