module.exports = function(setup) {
  var model = require('../models/account');
  var app = setup.app;
  var path = setup.config.path || '/auth';

  app.post(auth+'/account/create', function(req, res) {
    model.create(req.body.user, function(err, result){
      if( err ) {
        return utils.sendError(res, err);
      }

      resp.send({success: true});
    });
  });

  app.post(auth+'/account/update', function(req, res) {
    model.update(req.body.user, function(err, result){
      if( err ) {
        return utils.sendError(res, err);
      }

      resp.send({success: true});
    });
  });
};
