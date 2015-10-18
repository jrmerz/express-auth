var setup = require('../../setup');

module.exports = function(username, callback) {

  if( !username ) {
    return callback('username required');
  }

  if( username.length < 4 ) {
    return callback('Username must be at least 4 charaters');
  }

  if( username.match(/[^\w-_]/) ) {
    return callback('Invalid username characters: '+username.replace(/[\w-_]/g, ''));
  }

  setup
    .collection('accounts')
    .findOne(
      {username: username},
      {username: 1},
      function(err, result){
        if( err ) {
          return callback(err);
        }

        if( result !== null ) {
          return callback('Username taken: '+username);
        }

        callback(null, {available: true});
      }
    );
};
