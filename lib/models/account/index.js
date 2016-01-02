var uuid = require('node-uuid');

module.exports = function() {
  return {
    get : get,
    newDevToken : newDevToken
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
    }, callback);

}
