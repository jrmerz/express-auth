var gitkitClient = require('../../modles/gitkit');

modules.export = function(setup) {
  var app = setup.app;

  gitkitClient = new GitkitClient(JSON.parse(fs.readFileSync(setup.config.gitkit)));
  var renderGitkitWidgetPage = require('renderGitkitWidgetPage')(setup);

  app.get('/gitkit', renderGitkitWidgetPage);
  app.post('/gitkit', renderGitkitWidgetPage);

  // Ajax endpoint to send email for password-recovery and email change event
  app.post('/sendemail', renderSendEmailPage);
  app.get('/verify', getEmailVerification);
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
