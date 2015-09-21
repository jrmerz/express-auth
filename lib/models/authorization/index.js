var acllib = require('acl');
var setup, acl;

// init the acl
function init(s) {
  setup = s;
  acl = new acllib(new acllib.mongodbBackend(setup.db, 'acl_'));

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
