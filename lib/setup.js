var collections = {};
var config = {};
var db = {};
var app = {};
var passport = {};
var acl = {};

module.exports = {
  init : function(setup) {
    db = setup.db;
    app = setup.app;

    // a lot of times we will store auth config in a sperate file
    if( typeof setup.config === 'string' ) {
      setup.config = require(setup.config);
    }
    config = setup.config;

    // set default path if not provided
    config.path = config.path || '/auth';

    // quick access to users collection
    this.setCollection('users', db.collection(config.usersCollection || 'users'));
    // quick access to account collection
    this.setCollection('accounts', db.collection(config.accountCollection || 'accounts'));
  },

  collection : function(collectionName) {
    return collections[collectionName];
  },
  setCollection : function(name, collections) {
    collections[name] = collections;
  },

  app : function() {
    return app;
  },

  config : function() {
    return config;
  },
  setConfig : function(c) {
    config = c;
  },

  setPassport : function(p) {
    passport = p;
  },
  passport : function() {
    return passport;
  },

  setAcl : function(a) {
    acl = a;
  },
  acl : function() {
    return acl;
  }
};
