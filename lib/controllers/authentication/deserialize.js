var setup = require('../../setup');

module.exports = function(id, done) {
  setup
    .collection('users')
    .findOne(
      {id : id},
      {oauth: 0, local: 0, _id: 0},
      function(err, user){
        if( err ) {
          return done(err);
        }

        setAccountInfo(user, done);
      }
    );
};

function setAccountInfo(user, done) {
  setup.
    collection('accounts')
    .findOne(
      {id : user.id},
      {username : 1},
      function(err, account) {
        if( err ) {
          return done(err);
        }

        if( account ) {
          user.hasAccount = true;
          user.username = account.username;
        } else {
          user.hasAccount = false;
        }

        if( setup.deserialize ) {
          setup.deserialize(user, done);
        } else {
          done(null, user);
        }
      }
    );
}
