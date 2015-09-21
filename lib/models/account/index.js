var setup;
var utils = require('../../utils');

module.exports = function(s) {
  setup = s;

  return {
    create : require('./create')(setup),
    get : get,
    passwordsMatch : passwordsMatch
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
