var fs = require('fs');
var gitkitClient = require('../../models/gitkit');
var mailer = require('../../mailer')();
var account, config;

module.exports = function(setup) {
  var app = setup.app;
  config = setup.config;
  account = require('../../models/account')(setup);

  if( typeof config.signInWidget === 'string' ) {
    config.signInWidget = JSON.parse(fs.readFileSync(config.signInWidget));
  }

  // splash in some config so the user doesn't have to
  config.signInWidget.widgetUrl = config.host+config.path+'/gitkit';
  config.signInWidget.oobActionUrl = config.host+config.path+'/sendemail';

  gitkitClient = require('../../models/gitkit')();

  var renderGitkitWidgetPage = require('./renderGitkitWidgetPage')(setup);

  app.get(config.path+'/gitkit', renderGitkitWidgetPage);
  app.post(config.path+'/gitkit', renderGitkitWidgetPage);

  // Ajax endpoint to send email for password-recovery and email change event
  app.post(config.path+'/sendemail', renderSendEmailPage);
  app.get(config.path+'/verifyPage', renderVerifyPage);
  app.get(config.path+'/verify', getEmailVerification);

  app.get(config.path+'/signout', function(req, res) {
    res.clearCookie('gtoken');
    res.send({succes: true});
  });

  app.get(config.path+'/signoutRedirect', function(req, res) {
    res.clearCookie('gtoken');
    res.redirect(config.signInWidget.signOutUrl);
  });

  app.get(config.path+'/signin', function(req, res) {
    res.redirect(config.path+'/gitkit?mode=select');
  });

  // set new dev token
  config.protected[config.path+'/newDevToken'] = 'login';
  app.get(config.path+'/newDevToken', function(req, res){
    if( req.user.fromDevToken ) {
      return res.send({error: true, message: 'You cannot use a dev token to authorize a new dev token'});
    }

    account.newDevToken(req.user.id, function(err, token){
      if( err ) {
        return res.send({error: true, message: err});
      }
      res.send({token : token});
    });
  });


  config.protected[config.path+'/getDevToken'] = 'login';
  app.get(config.path+'/getDevToken', function(req, res) {
    account.getDevToken(req.user.id, function(err, token){
      if( err ) {
        return res.send({error: true, message: err});
      }
      res.send({token : token});
    });
  });
};

function renderSendEmailPage(req, res) {
  //app.disable('etag');

  gitkitClient.getOobResult(req.body, req.ip, req.cookies.gtoken, function(err, resp) {
    if (err) {
      res.send({error: true, message : err});
      return;
    } else {
      var msg = resp.email+',<br /><br />\n\n'+
        'Please click the following link to reset your password for '+config.signInWidget.siteName+
        ': <a href="'+resp.oobLink+'">'+resp.oobLink+'</a><br /><br />\n\n'+
        '-Thanks<br />\n'+config.signInWidget.siteName+' Team';

      mailer.send(resp.email, 'Reset Password', msg, function(err){
        if( err ) {
          res.send({error: true, message : err});
          return;
        }

        try {
          res.send(JSON.parse(resp.responseBody));
        } catch(e) {
          res.send(resp.responseBody);
        }

      });
    }
  });
}

function renderVerifyPage(req, res) {
  var template = fs.readFileSync(__dirname+'/gitkit-verify.html', 'utf-8');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  sendVerifyEmail(req.user, function(err){
    if( err ) {
      template = template.replace(/%%userinfo%%/, 'var User = '+JSON.stringify({error : true, message: err})+';');
    } else {
      var user = req.user || {};
      user.sender = config.mail.from;
      template = template.replace(/%%userinfo%%/, 'var User = '+JSON.stringify(user)+';');
    }

    res.end(template);
  });
}

function getEmailVerification(req, res) {
  sendVerifyEmail(req.user, function(err){
    if( err ) {
      return res.send({error : true, message: err});
    }

    res.send({success: true});
  });
}

function sendVerifyEmail(user, callback) {
  gitkitClient.getEmailVerificationLink(user.email, function(err, link){
    if( err ) {
      return callback(err);
    }

    var msg = user.display_name+',<br /><br />\n\n'+
      'Please click the following link to verify your email address for '+config.signInWidget.siteName+
      ': <a href="'+link+'">'+link+'</a><br /><br />\n\n'+
      '-Thanks<br />\n'+config.signInWidget.siteName+' Team';


    mailer.send(user.email, 'Verify Email Your Address', msg, function(err, result){
      console.log(err);
      console.log(result);
      if( err ) {
        return callback(err);
      }
      callback();
    });
  });
}

function printLoginInfo(res, loginInfo) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var html = new Buffer(fs.readFileSync('./index.html'))
      .toString()
      .replace('%%loginInfo%%', loginInfo);
  res.end(html);
}
