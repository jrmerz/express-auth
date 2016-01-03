var uuid = require('uuid');
var setup;

module.exports = function(s) {
  if( s ) {
    setup = s;
  }

  return {
    get : get,
    newDevToken : newDevToken,
    getDevToken : getDevToken
  };
};

function get(emailOrId, callback) {
  setup
    .usersCollection
    .findOne({
      $or : [
        {'gitkit.email' : emailOrId},
        {'gitkit.id' : emailOrId}
      ]
    }, callback);
}

function newDevToken(emailOrId, callback) {
  var token = {
    uuid : uuid.v4(),
    expires : new Date(new Date().getTime() + (1000 * 60 * 60 * 24))
  };

  setup
    .usersCollection
    .update({
      $or : [
        {'gitkit.email' : emailOrId},
        {'gitkit.id' : emailOrId}
      ]
    }, {
      $set : {
        token : token
      }
    }, function(err, result){
      if( err ) {
        return callback(err);
      }

      callback(null, token);
    });
}

function getDevToken(emailOrId, callback) {
  setup
    .usersCollection
    .findOne({
      $or : [
        {'gitkit.email' : emailOrId},
        {'gitkit.id' : emailOrId}
      ]
    }, {token: 1}, callback);
}
