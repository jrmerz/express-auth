var setup = require('../../setup');
var utils = require('../../utils');
var uuid = require('uuid');
var validUsername = require('./validUsername');


module.exports = function(user, account, callback) {
  if( !user ) {
    return callback('no user provided');
  }

  validUsername(account.username, function(err, valid){
    if( err ) {
      return callback(err);
    }

    account.id = user.id;

    setup
      .collection('accounts')
      .insert(account, function(err, result){
        if( err ) {
          return callback(err);
        }
        callback(null, {success:true});
      });
  });

};
