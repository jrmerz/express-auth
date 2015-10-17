var google;

module.exports = {
  importGoogle : function() {
    google = require('./google');
  },
  google : function() {
    return google;
  }
};
