var model = require('../lib/models/account');
var utils = require('./utils');
var libUtils = require('../lib/utils');
var assert = require('assert');
var extend = require('extend');

var userData1 = require('./data/users/user1');
var userData2 = require('./data/users/user2');
var copyUserData1 = extend(true, {}, userData1);

describe('Account', function() {
  before(function(done) {
    // connect and clear database
    utils.connect(function(err, db){
      utils.reset(function(){
        done();
      });
    });
  });

  describe('#create()', function() {
    it('should save without error', function(done) {
      var userModel = model(global.setup);

      userModel.create(userData1, function(err) {
        if (err) throw err;

        userModel.create(userData2, function(err) {
          if (err) throw err;
          done();
        });

      });
    });


    it('should NOT let you create another '+userData1.username, function(done) {
      var userModel = model(global.setup);

      userModel.create(userData1, function(err) {
        if( !err ) {
          throw 'Username '+userData1+' was allowed to be created twice';
        }

        done();
      });
    });


    it('should NOT let you create account with short password', function(done) {
      var userModel = model(global.setup);
      var userBadPass = require('./data/users/userBadPass');

      userModel.create(userBadPass, function(err) {
        if( !err ) {
          throw 'User creation allowed with short password';
        }

        done();
      });
    });
  });

  describe('#get()', function() {
    it('should get without error', function(done) {
      var userModel = model(global.setup);
      userModel.get(userData1.username, function(err, user){
        if( err ) throw err;

        assert.equal(user.username, userData1.username);
        done();
      });
    });

    it('should have the same salted password', function(done) {
      var userModel = model(global.setup);

      userModel.get(userData1.username, function(err, user){
        if( err ) throw err;

        assert.equal(user.username, userData1.username);

        // using copy.  userData1 is manipulated during create process
        // TODO: should the copy happen in the library?
        userModel.passwordsMatch(copyUserData1.password, user, function(err, match){
          if( err ) throw err;
          assert.equal(match, true);

          done();
        });
      });
    });
  });

  describe('#merge()', function() {
    it('should let you merge oauth data', function(done) {
      var userModel = model(global.setup);
      var oauthData = require('./data/oauth/user1.json');

      userModel.merge(userData1.username, 'google', oauthData, function(err, resp){
        if( err ) throw err;

        userModel.get(userData1.username, function(err, user) {
          for( var key in user.oauth.google ) {
            assert.equal(user.oauth.google[key], oauthData[key]);
          }

          done();
        });


      });
    });
  });
});
