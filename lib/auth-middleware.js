var users = {};
var config;
var usersCollection;

module.exports = function(setup) {
  config = setup.config;
  usersCollection = setup.collection('users');

  return function(req, res, next) {
    // always see if a proper developer token was passed
    checkDevToken(req, res, next,

      // this only fires if we can't find a dev token
      function(){


      if( !req.cookies.gtoken ) {
        return check(null, req, res, next);
      }

      if( !userInfo[req.cookies.gtoken] ) {
        gitkitClient.verifyGitkitToken(req.cookies.gtoken, function (err, resp) {
          if( err ) {
            res.clearCookie('gtoken');
            check(null, req, res, next, true);
          } else {
            // TODO: switch to redis
            userInfo[req.cookies.gtoken] = resp;
            check(resp, req, res, next, true);
          }
        });
      } else {
        check(userInfo[req.cookies.gtoken], req, res, next, true);
      }
    });

  };
};

function check(user, req, res, next, verifyInSystem) {
  if( config.protected[req.path] ) {
    // no user account
    if( !user ) {
      return res.send({error: true, message: 'You must be logged in'});
    }

    // user account but requires admin
    if( config.protected[req.path] === 'admin' && !user.admin ) {
      return res.send({error: true, message: 'nope.'});
    }

    // user account but email not verified
    if( !user.gitkit.verified ) {
      return res.redirect('/verify');
    }
  }

  req.user = user;

  // make sure verified user is in the system.
  if( verifyInSystem && user ) {
    checkInserted(user, next);
  } else {
    next();
  }
}

// TODO: we shouldn't be checking this every time we login...
function checkInserted(user, next) {
  usersCollection.findOne(
    {'gitkit.id': user.id},
    {_id:1},
    function(err, result){
      if( err || !result) {
        usersCollection.insert({
          app : {},
          gitkit : user
        }, function(err, result){
          next();
        });
      } else {
        next();
      }
    }
  );
}

// see if we can get user credentials from a supplied dev token
function checkDevToken(req, res, callback) {
  var devToken = req.query['dev-token'];
  if( !devToken ) {
    devToken = req.get('x-dev-token');
  }

  // no dev token provided
  if( !devToken ) {
    return callback();
  }

  usersCollection.findOne(
    {'token.uuid': devToken},
    {app:0},
    function(err, result){
      if( err ) {
        return callback();
      }
      if( !resp ) {
        return callback();
      }

      if( result.token.expires.getTime() < new Date().getTime() ) {
        res.send({error: true, message: 'Expired dev token provided'});
        return;
      }

      check(result.gitkit, req, res, next);
    }
  );

}
