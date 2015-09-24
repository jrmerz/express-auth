var redirectUrl = '';
var failureRedirect = '';

module.exports = function(setup) {
  var path = setup.config.path || '/auth';
  var app = setup.app;

  redirectUrl = setup.config.redirect || '/';
  failureRedirect = setup.config.failureRedirect || '/login';

  if( setup.config.local ) {
    app.post(path+'/local', setup.passport.authenticate('local'), success);
  }

  if( setup.config.google ) {
    var options = {
      scope : setup.config.google.scope
    };
    app.get(path+'/google', setup.passport.authenticate('google', options), success);
    app.get(path+'/google/callback', setup.passport.authenticate('google', { failureRedirect: failureRedirect}), success);
  }

  app.get(path+'/isLoggedIn', function(req, res){
    res.send({loggedIn: req.user ? true : false});
  });

  app.get(path+'/getUserInfo', function(req, res){
    res.send({user: req.user});
  });

};


function success(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.redirect(redirectUrl);
}
