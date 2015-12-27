var users = {};
var config;

module.exports = function(setup) {
  config = setup.config;

  return function(req, res, next) {
    if( !req.cookies.gtoken ) {
      return check(null, req, res, next);
    }

    if( !userInfo[req.cookies.gtoken] ) {
      gitkitClient.verifyGitkitToken(req.cookies.gtoken, function (err, resp) {
        if( err ) {
          res.clearCookie('gtoken');
          check(null, req, res, next);
        } else {
          // TODO: switch to redis
          userInfo[req.cookies.gtoken] = resp;
          check(resp, req, res, next);
        }
      });
    } else {
      check(userInfo[req.cookies.gtoken], req, res, next);
    }
  };
};

function check(user, req, res, next) {
  if( config.protected[req.path] ) {
    if( !user ) {
      return res.send({error: true, message: 'You must be logged in'});
    }
    if( config.protected[req.path] === 'admin' && !user.admin ) {
      return res.send({error: true, message: 'nope.'});
    }
  }

  req.user = user;

  next();
}
