var redirectUrl = '';
var failureRedirect = '';

module.exports = function(setup) {
  var path = setup.config.path || '/auth';

  redirectUrl = setup.config.redirect || '/';
  failureRedirect = setup.config.failureRedirect || '/login';

  if( setup.config.local ) {
    setup.app.post(path+'/local', setup.passport.authenticate('local'), success);
  }

  if( setup.config.google ) {
    var options = {
      scope : setup.config.google.scope
    };
    setup.app.get(path+'/google', setup.passport.authenticate('google', options), success);
    setup.app.get(path+'/google/callback', setup.passport.authenticate('google', { failureRedirect: failureRedirect}), success);
  }
};


function success(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.redirect(redirectUrl);
}
