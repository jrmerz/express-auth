var setup = require('../../setup');
var acllib = require('acl');

// init the acl
module.exports = function() {
  // useSingle = true, otherwise tons of collections
  var acl = new acllib(new acllib.mongodbBackend(setup.db(), 'acl_', true));
  setup.setAcl(acl);
};
