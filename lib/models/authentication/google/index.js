var uuid = require('uuid');
var setup = require('../../../setup');

/* profile
  id : String,
  displayName : String,
  name : {
    familyName : String,
    givenName : String
  },
  emails : [{
    value : String,
    type : String
  }],
  photos : [{
    value : String
  }],
  gender : String,
  _json : Object
}
*/
function login(accessToken, refreshToken, profile, done) {
  setup.collection('users').findOne({'oauth.google.id': profile.id }, function (err, user) {
    if( err ) {
      return done(err);
    }

    // leave it to the app to handle no user creation
    if( !user ) {
      return createOauthUser(collection, accessToken, refreshToken, profile, done);
    }

    return done(err, user);
  });
}


function createOauthUser(collection, accessToken, refreshToken, profile, done) {
  profile.refreshToken = refreshToken;
  delete profile._raw;
  delete profile._json;

  var user = {
    id : uuid.v4(),
    name : profile.displayName,
    email : profile.emails[0].value,
    verifiedEmail : true,
    oauth : {
      google : profile,
    }
  };

  setup.collection('users').insert(user, function(err, result){
    done(err, user);
  });
}


module.exports = {
  login : login
};
