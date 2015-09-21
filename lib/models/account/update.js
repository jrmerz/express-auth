var utils = require('./utils');

module.exports = function(setup) {
  return function(user, callback) {

    if( user.password ) {
      if( user.password.length < 6 ) {
        return callback('Password must be at least 6 charaters');
      }
    }

    setup.usersCollection.findOne({username: user.username}, function(err, result){
      if( err ) {
        return callback(err);
      }

      if( result === null ) {
        return callback('Invalid username');
      }

      if( user.password ) {
        utils.hashPassword(user.password, function(err, hash){
          if( err ) {
            return callback(err);
          }

          if( result.local ) {
            user.local.password = hash;
          } else {
            user.local = {
              password : hash
            };
          }

          delete user.password;

          updateAccount(setup, user, callback);
        });
      } else {
        updateAccount(setup, user, callback);
      }

    });
  };
};

function createAccount(setup, user, callback) {
  setup.usersCollection.update(user, function(err, result){
    if( err ) {
      return callback(err);
    }

    callback(null, user);
  });
}
