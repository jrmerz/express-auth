

var authSetup = require('./lib/setup');
var authorization = require('./lib/models/authorization');
var authentication = require('./lib/controllers/authentication');
var admin = require('./lib/controllers/admin');
var account = require('./lib/controllers/account');

module.exports = {
  init : function(config) {

    // you can turn this off via bodyParserInstalled flag
    if( !config.bodyParserInstalled && config.app ) {
      var bodyParser = require('body-parser');
      // parse application/x-www-form-urlencoded
      config.app.use(bodyParser.urlencoded({ extended: true }));
      // parse application/json
      config.app.use(bodyParser.json());
    }

    authSetup.init(config);

    // init the authentication (passport)
    authentication();

    // init the authorization (acl)
    authorization();

    // init the admin functionality
    admin();

    // setup account endpoints
    account();

    return authSetup;
  },
  getSetup : function() {
    return authSetup;
  }
};
