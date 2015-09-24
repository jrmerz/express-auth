/**
 * IMPORTANT.  Assuming account.js has run
 *
 * This is really just re-testing acl lib, not going to do much here
 **/
var utils = require('./utils');
var assert = require('assert');
var async = require('async');

var userRoles1 = require('./data/roles/user1');
var userData1 = require('./data/users/user1');
var acl;

describe('Authorization', function() {
  before(function(done) {
    // connect and keep database state
    utils.connect(function(err, db){
      acl = global.setup.acl;

      done();
    });
  });

  describe('#create()', function() {

    it('should save without error', function(done) {
      async.eachSeries(
        userRoles1,
        function(role, next){
          acl.allow(userData1.username, role.group, role.role, function(err) {
            if (err) throw err;
            next();
          });
        },
        function(err) {
          if( err ) throw err;
          done();
        }
      );
    });

  }); // end create
});
