var setup;
var utils = require('../../utils');

module.exports = function(s) {
  setup = s;

  return {
    create : require('./create')(setup),
    update : require('./update')(setup),
    get : get,
    passwordsMatch : passwordsMatch,
    merge : merge
  };
};

function get(username, callback) {
  setup.usersCollection.findOne({username: username}, callback);
}

function passwordsMatch(password, user, callback) {
  if( !user ) {
    return callback('No user provided');
  } else if( !password ) {
    return callback('No password provided');
  } else if( user.local === undefined ) {
    return callback('User has no local authentication');
  }

  utils.passwordsMatch(password, user.local.password, callback);
}

function merge(username, authDomain, oauthData, callback) {
  if( typeof authDomain !== 'string' ) {
    return callback('Auth domain must be a string');
  } else if( typeof oauthData !== 'object' ) {
    return callback('Oauth data must be an object');
  }

  get(username, function(err, user){
    if( err ) {
      return callback(err);
    }

    if( !user.oauth ) {
      user.oauth = {};
    }

    user.oauth[authDomain] = oauthData;

    setup.usersCollection.update({username: username}, user, callback);
  });
}
