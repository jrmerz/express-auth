var utils = require('../../utils');
var uuid = require('uuid');
var validUsername = require('../account/validUsername');
var passwordUtil = require('./password');

// this is only for local accounts
module.exports = function(setup) {
  return function(user, callback) {

    if( !user.username ) {
      return callback('Username required');
    } else if( user.username.length < 3 ) {
      return callback('Username must be at least 3 charaters');
    }

    if( !user.email ) {
      return callback('Email required');
    }

    var verify = passwordUtil.verify(user.password);
    if( verify.error ) {
      return callback(verify.message);
    }

    validUsername(user.username, function(err, result){
      if( err ) {
        return callback(err);
      }

      passwordUtil.hash(user.password, function(err, hash){
        if( err ) {
          return callback(err);
        }

        user.local = {
          password : hash,
          verifyToken : uuid.v4()+uuid.v4()
        };
        
        user.hasLocal = true;
        user.verifiedEmail = false;

        delete user.password;
        user.id = uuid.v4();

        createAccount(setup, user, callback);
      });
    });
  };
};

function createAccount(setup, user, callback) {
  setup.collection('users').insert(user, function(err, result){
    if( err ) {
      return callback(err);
    }

    callback(null, user);
  });
}
