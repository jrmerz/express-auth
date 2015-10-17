var utils = require('../../utils');
var uuid = require('uuid');
var validUsername = require('validUsername');

// this is only for local accounts
module.exports = function(user, username, callback) {
  if( !user ) {
    return callback('no user provided');
  }

  validUsername(username, function(err, valid){
    if( err ) {
      return callback(err);
    }

    var account = {
      id : user.id,
      username : username
    };

    setup
      .collection('account')
      .insert(account, callback);
  });

};
