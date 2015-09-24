var express = require('express');
var MongoClient = require('mongodb').MongoClient;

var app = express();
var auth = require(__dirname+'/../../index.js');

app.use(express.static(__dirname+'/public'));

var config = {
  sessionSecret : 'thisisnotasecret'
};

function oauthNoUser(collection, accessToken, refreshToken, profile, done) {

}


MongoClient.connect('mongodb://localhost:27017/farmBudgets', function(err, db){
  if( err ) {
    console.log(err);
    process.exit(-1);
  }

  auth.init({
    db : db,
    app : app,
    config : config,
    oauthNoUser : oauthNoUser
  });
});


app.listen(3000);
console.log('listening on 3000');
