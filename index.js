var authorization = require('./lib/models/authorization');
var authentication = require('./lib/controllers/authentication');
var admin = require('./lib/controllers/admin');

module.exports = {
  init : init
};

function init(setup) {
  // a lot of times we will store auth config in a sperate file
  if( typeof setup.config === 'string' ) {
    setup.config = require(setup.config);
  }

  // check users collection
  if( !setup.config.usersCollection ) {
    setup.config.usersCollection = 'users';
  }

  // quick access to users collection
  setup.usersCollection = setup.db.collection(setup.config.usersCollection);

  // init the authentication (passport)
  authentication.init(setup);

  // init the authorization (acl)
  authorization.init(setup);

  // init the admin functionality
  admin.init(setup);
}
