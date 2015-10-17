var setup = require('../../setup');

module.exports = function(username) {
  setup
    .collection('account')
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
