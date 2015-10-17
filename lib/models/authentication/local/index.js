var setup = require('../../setup');
var utils = require('../utils');

function loginfunction(username, password, done) {
  collection.findOne({ username: username }, function (err, user) {
    if( err ) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    utils.passwordsMatch(password, user.local.password, function(err, isMatch){
      if( err ) {
        return done(err);
      }
      if( !isMatch ) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      done(null, user);
    });
  });
}
