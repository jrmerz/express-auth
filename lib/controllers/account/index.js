var fs = require('fs');
var gitkitClient = require('../../models/gitkit');
var mailer = require('../../mailer');
var account = require('../../models/account');


module.exports = function(setup) {
  var config = setup.config;
  var app = setup.app;

  app.get(config.path+'/isLoggedIn', function(req, res){
      res.send({loggedIn: req.user ? true : false});
  });

  config.protected[config.path+'/getUserInfo'] = 'login';
  app.get(config.path+'/getUserInfo', function(req, res){
      res.send(req.user);
  });

  app.get(config.path+'/express-auth.js', function(req, res){
    res.set('Content-Type', 'application/javascript');

    var lib = {
      user : req.user
    };

    res.send('var ExpressAuth = '+JSON.stringify(lib)+';');
  });
};
