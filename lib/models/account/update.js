var utils = require('./utils');
var reserved = ['_id', 'local', 'oauth'];

module.exports = function(setup) {
  return function(user, callback) {

    if( user.password ) {
      if( user.password.length < 6 ) {
        return callback('Password must be at least 6 charaters');
      }
    }

    for( var i = 0; i < reserved.length; i++ ) {
      if( user[reserved[i]] !== undefined ) {
        return callback(reserved[i]+' is a reserved attribute');
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
            result.local.password = hash;
          } else {
            result.local = {
              password : hash
            };
          }

          delete user.password;

          updateAccount(setup, user, result, callback);
        });
      } else {
        updateAccount(setup, user, result, callback);
      }

    });
  };
};

function createAccount(setup, newData, user, callback) {
  for( var key in user ) {
    user[key] = newData[key];
  }

  setup.usersCollection.update(user, function(err, result){
    if( err ) {
      return callback(err);
    }

    callback(null, user);
  });
}
