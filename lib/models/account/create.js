var utils = require('../../utils');

module.exports = function(setup) {
  return function(user, callback) {

    if( !user.username ) {
      return callback('Username required');
    } else if( user.username.length < 3 ) {
      return callback('Username must be at least 3 charaters');
    }

    if( user.password ) {
      if( user.password.length < 6 ) {
        return callback('Password must be at least 6 charaters');
      }
    }

    setup.usersCollection.findOne({username: user.username}, function(err, result){
      if( err ) {
        return callback(err);
      }

      if( result !== null ) {
        return callback('Username taken: '+user.username);
      }

      if( user.password ) {
        utils.hashPassword(user.password, function(err, hash){
          if( err ) {
            return callback(err);
          }

          user.local = {
            password : hash
          };

          delete user.password;

          createAccount(setup, user, callback);
        });
      } else {
        createAccount(setup, user, callback);
      }

    });
  };
};

function createAccount(setup, user, callback) {
  setup.usersCollection.insert(user, function(err, result){
    if( err ) {
      return callback(err);
    }

    callback(null, user);
  });
}
