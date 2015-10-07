var utils = require('../../utils');

module.exports = function(setup) {

  function getAllUsers(query, callback) {
    setup.usersCollection.find(query, {password: 0}).toArray(callback);
  }

  function getUserRoles(user, callback) {
    setup.acl.userRoles(req.query.user, callback);
  }


  return {
    getUserRoles : getUserRoles,
    getAllUsers : getAllUsers
  };
};
