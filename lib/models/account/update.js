var utils = require('../../utils');
var reserved = ['_id', 'local', 'oauth'];

module.exports = function(setup) {
  return function(user, callback) {

    setup.usersCollection.findOne({'gitkit.id': user.id}, function(err, result){
      if( err ) {
        return callback(err);
      }

      if( result === null ) {
        return callback('Invalid user id');
      }

      updateAccount(setup, user, result, callback);

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
