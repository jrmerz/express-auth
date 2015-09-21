var bcrypt = require('bcrypt');

function hashPassword(password, callback) {
  bcrypt.hash(password, 8, callback);
}

function passwordsMatch(password, hash, callback) {
  bcrypt.compare(password, hash, callback);
}

function isAdmin(req, acl, callback) {
  isIn(req, acl, 'admin', callback);
}

function isIn(req, acl, role, callback) {
  if( !req.user ) {
    return callback(null, false);
  }

  acl.hasRole(req.user.id, role, callback);
}


// helper for sending errors
function sendError(res, msg, code) {
  var error = {
    error : true,
    message : msg
  };

  if( code !== undefined ) {
      error.code = code;
  }

  res.send(error);
}

module.exports = {
  sendError : sendError,
  isAdmin : isAdmin,
  isIn : isIn,
  hashPassword : hashPassword,
  passwordsMatch : passwordsMatch
};
