var utils = require('../../utils');
var adminUtils = require('../../models/admin/utils');
var model = require('../../models/admin');
var setup = require('../../setup');

module.exports = function() {
  var admin = model();

  // get the list of current users
  setup.app().get('/admin/users', adminUtils.isAdminMiddleware, function(req, res) {
    setup.collection('users').find({}, {password: 0}).toArray(function(err, result){
      if( err ) {
        return utils.sendError(res, err);
      }

      resp.send(result);
    });
  });

  setup.app().get('/admin/user/roles', adminUtils.isAdminMiddleware, function(req, res) {
    admin.getUserRoles(req.query.user, function(err, roles){
      if( err ) {
        return utils.sendError(res, err);
      }

      resp.send(roles);
    });
  });
};
