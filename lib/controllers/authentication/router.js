var setup = require('../../setup');
var extend = require('extend');
var clientConfig = require('./clientConfig');

var redirectUrl = '';
var failureRedirect = '';

module.exports = function(model) {
  var config = setup.config();
  var path = config.path;
  var app = setup.app();

  redirectUrl = config.redirect || '/';
  failureRedirect = config.failureRedirect || '/login';

  clientConfig.path = path;

  if( config.local ) {
    app.post(path+'/local', setup.passport().authenticate('local'), success);
    app.post(path+'/local/create', createLocalAccount);
    clientConfig.allowLocal = true;
  }

  /*
   * Make sure Google+ API is enable for 'email' scope
   */
  if( config.google ) {
    var options = {
      scope : config.google.scopes ? config.google.scopes.join(' ') : 'email'
    };

    app.get(path+'/google', setup.passport().authenticate('google', options));
    app.get(
      path+'/google/callback',
      setup.passport().authenticate('google', { failureRedirect: failureRedirect}),
      success
    );

    clientConfig.oauthProviders.push({
      label : 'Google',
      href : path+'/google'
    });
  }

  app.get(path+'/isLoggedIn', function(req, res){
    res.send({loggedIn: req.user ? true : false});
  });

  app.get(path+'/getUserInfo', function(req, res){
    res.send({user: req.user});
  });

  app.get(path+'/express-auth.js', function(req, res){
    res.header('content-type','application/javascript');
    res.send(getClientLib(req.user));
  });
};

function getClientLib(user) {
  var config = extend(true, {}, clientConfig);
  config.user = user;
  config.isLoggedIn = user ? true : false;

  return 'var ExpressAuth = '+JSON.stringify(config);
}


function success(req, res, next) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.redirect(redirectUrl);
}
