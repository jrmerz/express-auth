var google, local;

module.exports = {
  importGoogle : function() {
    google = require('./google');
  },
  google : function() {
    return google;
  },

  importLocal : function() {
    local = require('./local');
  },
  local : function() {
    return local;
  },

  verifyEmail : require('./verifyEmail')
};
