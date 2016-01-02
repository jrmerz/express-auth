var setup = require('../../setup');
var acllib = require('acl');

// init the acl
module.exports = function(setup, auth) {
  var prefix = setup.config.aclPrefix ? setup.config.aclPrefix+'_' : 'acl_';

  // useSingle = true, otherwise tons of collections
  auth.acl = new acllib(new acllib.mongodbBackend(setup.db, prefix, true));
};
