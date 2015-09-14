var utils = require('./utils');

module.exports = function(setup) {
  var model = require('../models/admin')(setup);

  // get the list of current users
  setup.app.get('/admin/users', utils.isAdminMiddleware, function(req, res) {
    setup.usersCollection.find({}, {password: 0}).toArray(function(err, result){
      if( err ) {
        return utils.sendError(res, err);
      }

      resp.send(result);
    });
  });

  setup.app.get('/admin/user/roles', utils.isAdminMiddleware, function(req, res) {
    admin.getUserRoles(req.query.user, function(err, roles){
      if( err ) {
        return utils.sendError(res, err);
      }

      resp.send(roles);
    });
  });
};
