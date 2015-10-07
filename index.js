var authorization = require('./lib/models/authorization');
var authentication = require('./lib/controllers/authentication');

module.exports = {
  init : init
};

function init(setup) {
  // a lot of times we will store auth config in a sperate file
  if( typeof setup.config === 'string' ) {
    setup.config = require(setup.config);
  }

  // quick access to users collection
  setup.usersCollection = setup.db.collection(setup.config.usersCollection || 'users');

  // init the authentication (passport)
  authentication.init(setup);

  // init the authorization (acl)
  authorization.init(setup);

  // init the admin functionality
  require('./lib/controllers/admin')(setup);
}
