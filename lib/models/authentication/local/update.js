var setup = require('../../../setup');
var passwordUtil = require('./password');

function updatePassword(user, newPassword, callback) {

  var verify = passwordUtil.verify(newPassword);
  if( verify.error ) {
    callback(verify.message);
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
}

module.exports = {
  resetPassword : resetPassword,
  updatePassword : updatePassword
};
