var setup = require('../../setup');
var utils = require('../../utils');

module.exports = function() {
  var app = setup.app();
  if( !app ) {
    return;
  }

  var model = require('../../models/account')();
  var path = setup.config().path;

  app.post(path+'/account/create', function(req, res) {
    model.create(req.user, req.body.account, function(err, result){
      if( err ) {
        return utils.sendError(res, err);
      }

      res.send({success: true});
    });
  });

  app.post(path+'/account/update', function(req, res) {
    model.update(req.user, req.body.account, function(err, result){
      if( err ) {
        return utils.sendError(res, err);
      }

      res.send({success: true});
    });
  });

  app.get(path+'/account/validUsername', function(req, res) {
    model.validUsername(req.query.username, function(err, result){
      if( err ) {
        return utils.sendError(res, err);
      }

      res.send({success: true});
    });
  });
};
