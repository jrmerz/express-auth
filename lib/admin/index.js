var utils = require('../utils');
var setup;

function init(s) {
  setup = s;

  // get the list of current users
  setup.app.get('/admin/users', isAdminMiddleware, function(req, res) {
    setup.usersCollection.find({}, {password: 0}).toArray(function(err, result){
      if( err ) {
        return utils.sendError(res, err);
      }

      resp.send(result);
    });
  });

  setup.app.get('/admin/user/roles', isAdminMiddleware, function(req, res) {
    setup.acl.userRoles(req.query.user, function(err, roles){
      if( err ) {
        return utils.sendError(res, err);
      }

      resp.send(roles);
    });
  });
};

function isAdminMiddleware(req, res, next) {
  utils.isAdmin(req, setup.acl, function(err, isAdmin){
    if( err ) {
      return utils.sendError(res, err);
    }

    if( !isAdmin ) {
      return utils.sendError(res, 'nope.');
    }

    next();
  });
}

module.exports = {
  init : init
};
