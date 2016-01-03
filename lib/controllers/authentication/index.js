var fs = require('fs');
var gitkitClient = require('../../models/gitkit');
var mailer = require('../../mailer');
var account = require('../../models/account');

module.exports = function(setup) {
  var app = setup.app;
  var config = setup.config;

  // splash in some config so the user doesn't have to
  config.gitkit.widgetUrl = config.host+config.path+'/gitkit';
  config.signInWidget.widgetUrl = config.host+config.path+'/gitkit';
  config.signInWidget.oobActionUrl = config.host+config.path+'/sendemail';

  if( typeof config.signInWidget === 'string' ) {
    config.signInWidget = JSON.parse(fs.readFileSync(config.signInWidget));
  }

  gitkitClient = require('../../models/gitkit')(setup);

  var renderGitkitWidgetPage = require('./renderGitkitWidgetPage')(setup);

  app.get(config.path+'/gitkit', renderGitkitWidgetPage);
  app.post(config.path+'/gitkit', renderGitkitWidgetPage);

  // Ajax endpoint to send email for password-recovery and email change event
  app.post(config.path+'/sendemail', renderSendEmailPage);
  app.get(config.path+'/verify', getEmailVerification);

  // set new dev token
  config.protected[config.path+'/newDevToken'] = 'login';
  app.get(config.path+'/newDevToken', function(req, res){
    account.newDevToken(function(err, token){
      if( err ) {
        return res.send({error: true, message: err});
      }
    });
  });


  config.protected[config.path+'/getDevToken'] = 'login';
  app.get(config.path+'/getDevToken', function(req, res) {
    account.getDevToken(req.user.id, function(err, token){
      if( err ) {
        return res.send({error: true, message: err});
      }
    });
  });
};

function renderSendEmailPage(req, res) {
  app.disable('etag');
  console.log(req.body);
  gitkitClient.getOobResult(req.body, req.ip, req.cookies.gtoken, function(err, resp) {
    if (err) {
      console.log('Error: ' + JSON.stringify(err));
    } else {
      // Add code here to send email
      console.log('Send email: ' + JSON.stringify(resp));
      mailer.send(resp.email, 'Reset Password', JSON.stringify(resp), function(err){

      });
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(res.responseBody);
  });
}

function getEmailVerification(req, res) {
  gitkitClient.getEmailVerificationLink(userInfo[req.cookies.gtoken].email, function(err, link){
    console.log(err);
    console.log(link);
    res.send(link);
  });
}

function printLoginInfo(res, loginInfo) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var html = new Buffer(fs.readFileSync('./index.html'))
      .toString()
      .replace('%%loginInfo%%', loginInfo);
  res.end(html);
}
