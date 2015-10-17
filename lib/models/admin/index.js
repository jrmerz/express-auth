var setup = require('../../setup');
var utils = require('../../utils');

module.exports = function() {

  function getAllUsers(query, callback) {
    setup.collection('users').find(query, {password: 0}).toArray(callback);
  }

  function getUserRoles(user, callback) {
    setup.acl().userRoles(req.query.user, callback);
  }


  return {
    getUserRoles : getUserRoles,
    getAllUsers : getAllUsers
  };
};
