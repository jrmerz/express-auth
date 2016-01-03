var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var app = express();
var auth = require(__dirname+'/../../index.js');


var config = {
  redirect : '/login.html',
  url : 'http://localhost:3000',
  sessionSecret : 'thisisnotasecret',
  usersCollection : 'users',
  google : require('/etc/express-auth/google')
};


MongoClient.connect('mongodb://localhost:27017/expressAuthTest', function(err, db){
  if( err ) {
    console.log(err);
    process.exit(-1);
  }

  auth.init({
    db : db,
    app : app,
    config : {
      host : 'http://localhost:3000',
      gitkit : '/etc/express-auth/gitkit.json',
      signInWidget : '/etc/express-auth/signInWidget.json',
      installRequiredMiddleware : true,
      protected : {}
    }
  });

  app.use(express.static(__dirname+'/public'));
  app.listen(3000);
  console.log('listening on 3000');
});
