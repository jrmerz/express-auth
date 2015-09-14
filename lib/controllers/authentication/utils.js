var bcrypt = require('bcrypt');

function hashPassword(password, callback) {
  bcrypt.hash(password, 8, callback);
}

function passwordsMatch(password, hash, callback) {
  bcrypt.compare(password, hash, callback);
}
