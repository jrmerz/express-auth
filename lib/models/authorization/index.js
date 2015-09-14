var acl = require('acl');
var setup;

// init the acl
function init(s) {
  setup = s;
  acl = new acl.mongodbBackend(setup.db, 'acl_');

  setup.acl = acl;
}

function middleware(req, res, next) {
  // not sure yet ...
}

function get() {
  return acl;
}

module.exports = {
  init : init,
  middleware : middleware,
  get : get
};
