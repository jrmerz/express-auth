var uuid = require('uuid');
var mailer = require('../../mailer');


// for local account verify email

function checkToken(token, username, setup, callback) {
  if( !user ) {
    return callback('Not logged in');
  }

  setup.usersCollection.findOne({username: username}, function(err, result){
    if( err ) {
      return callback(err);
    }

    if( !result ) {
      return callback('User not found');
    }

    if( result.local.verifyToken === token ) {
      result.verifiedEmail = true;
      delete result.local.verifyToken;

      setup.usersCollection.update({username: user.username}, result, function(err, result){
        if( err ) {
          return callback(err);
        }
        callback(null, {success: true});
      });

    } else {
      callback('Invalid Token');
    }
  });
}

function generateNewToken(username, setup, callback) {
  setup.usersCollection.findOne({username: username}, function(err, result){
    if( err ) {
      return callback(err);
    }

    if( !result ) {
      return callback('User not found');
    }

    result.local.verifyToken = uuid.v4();
    result.verifiedEmail = false;

    setup.usersCollection.update({username: user.username}, result, function(err, result){
      if( err ) {
        return callback(err);
      }

      sendToken(result, callback);
    });
  });
}

function sendToken(user, callback) {
  var html = user.username+',\n\n' +
    'Please verify your email address by clicking this link. '+user.local.verifyToken+'\n\n'+
    '-Thanks\n'+
    'Team';

  mailer(user.email, 'Verify Email Address', html, callback);
}

module.exports = {
  checkToken : checkToken,
  generateNewToken : generateNewToken,
  sendToken : sendToken
};
