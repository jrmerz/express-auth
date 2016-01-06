var gitkitClient = require('./models/gitkit')();
var querystring = require('querystring');

var debug = false;
var userInfo = {};
var config;
var usersCollection;

module.exports = function(setup) {
  config = setup.config;
  usersCollection = config.usersCollection;

  return function(req, res, next) {
    log(' +++ Express-Auth Middleware +++ ');
    // always see if a proper developer token was passed
    checkDevToken(req, res, next,

      // this only fires if we can't find a dev token
      function(){
        log('** Checking gtoken cookie ');

        // if no token, no user, check access with null user
        if( !req.cookies.gtoken ) {
          log('gtoken cookie not found');
          return check(null, req, res, next);
        }

        // if this request is for /auth/gitkit the user status may have changed
        // so we have to assume the user cache is invalid
        if( req.path === config.path+'/gitkit' && userInfo[req.cookies.gtoken] ) {
          delete userInfo[req.cookies.gtoken];
        }

        if( !userInfo[req.cookies.gtoken] ) {
          log('cached user info not found, requesting user info from google.');
          gitkitClient.verifyGitkitToken(req.cookies.gtoken, function (err, resp) {
            if( err ) {
              log('error in google user git token request: ');
              log(err);

              res.clearCookie('gtoken');
              check(null, req, res, next, true);
            } else {
              log('google user git token request success: ');
              log(resp);

              // TODO: switch to redis
              resp.id = resp.user_id;
              userInfo[req.cookies.gtoken] = resp;
              check(resp, req, res, next, true);
            }
          });
        } else {
          log('user info cache hit');
          check(userInfo[req.cookies.gtoken], req, res, next, false);
        }
    });

  };
};

function check(user, req, res, next, verifyInSystem) {
  log('** Checking url: '+req.path);
  if( config.protected[req.path] ) {

    var type = 'rest', level = 'login';
    if( typeof config.protected[req.path] === 'object' ) {
      var p = config.protected[req.path];
      if( p.type ) type = p.type.toLowerCase();
      if( p.level ) level = p.level.toLowerCase();
    } else {
      level = config.protected[req.path];
    }

    log(req.path+' is protected, type = '+type);


    // no user account
    if( !user ) {
      log('No user for protected path, sending error response');

      if( type === 'rest' ) {
        res.send({error: true, message: 'You must be logged in'});
      } else {
        res.redirect(config.loginPath);
      }

      return;
    }

    // user account but requires admin
    if( level === 'admin' && !user.admin ) {
      log('No admin for admin protected path, sending error response');

      if( type === 'rest' ) {
        res.send({error: true, message: 'nope.'});
      } else {
        res.redirect(config.loginPath);
      }

      return;
    }

    // user account but email not verified
    if( !user.verified ) {
      log('User does not have a verified email for a protected path, redirecting to verify');

      if( type === 'rest' ) {
        res.send({error: true, message: 'You do not have a verified email acccount.  Please proceed to the following url to verify: '+config.host+config.path+'/verify'});
      } else {
        res.redirect(config.path+'/verifyPage?'+querystring.stringify({continue: req.url}));
      }

      return;
    }
  } else {
    log(req.path+' is not protected');
  }

  log('setting user object in request object');
  req.user = user;

  // make sure verified user is in the system.
  if( verifyInSystem && user ) {
    checkInserted(user, next);
  } else {
    log(' --- Done With Express-Auth Middleware --- ');
    next();
  }
}

// TODO: we shouldn't be checking this every time we login...
function checkInserted(user, next) {
  log('** Checking user inserted into MongoDB');

  usersCollection.findOne(
    {'gitkit.id': user.id},
    {_id:1, admin: 1},
    function(err, result) {
      if( err ) {
        log('error with get user query: ');
        log(err);
      }

      if( err || !result) {
        log('user not found, inserting');

        usersCollection.insert({
          app : {},
          gitkit : user
        }, function(err, result){
          if( err ) {
            log('error inserting user into MongoDB');
            log(err);
          } else {
            log('success inserting user into MongoDB');
            log(result);
          }

          log(' --- Done With Express-Auth Middleware --- ');
          next();
        });
      } else {
        user.admin = result.admin ? true : false;
        log('user found, moving on');
        log(' --- Done With Express-Auth Middleware --- ');
        next();
      }
    }
  );
}

// see if we can get user credentials from a supplied dev token
function checkDevToken(req, res, next, callback) {
  log('** Checking for dev token');

  var devToken = req.query['dev-token'];
  if( !devToken ) {
    devToken = req.get('x-dev-token');
  }

  // no dev token provided
  if( !devToken ) {
    log('token not found in query or header, ignoring');
    return callback();
  }

  log('verifing dev token in MongoDB');
  usersCollection.findOne(
    {'token.uuid': devToken},
    {app:0},
    function(err, result){
      if( err ) {
        log('error in MongoDB query: ');
        log(err);
        return callback();
      }
      if( !result ) {
        log('token not found');
        return callback();
      }

      if( result.token.expires.getTime() < new Date().getTime() ) {
        log('token expired');
        res.send({error: true, message: 'Expired dev token provided'});
        return;
      }

      result.gitkit.fromDevToken = true;

      check(result.gitkit, req, res, next);
    }
  );

}

function log(msg) {
  if( debug ) {
    console.log(msg);
  }
}
