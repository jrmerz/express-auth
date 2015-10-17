var bcrypt = require('bcrypt');

function hash(password, callback) {
  bcrypt.hash(password, 8, callback);
}

function match(password, hash, callback) {
  bcrypt.compare(password, hash, callback);
}

function valid(password) {
  if( !password ) {
    return {
      error : true,
      message : 'Password required'
    };
  }

  if( password.length < 6 ) {
    return {
      error : true,
      message : 'Password must be at least 6 charaters'
    };
  }

  return {valid: true};
}

return {
  hash : hash,
  match : match,
  valid : valid
};
