var fs = require('fs');
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter, options = {};

module.exports = function(config) {
  if( config ) {
    if( typeof config.mail === 'string' ) {
      config.mail = JSON.parse(fs.readFileSync(config.mail, 'utf-8'));
    }

    transporter = nodemailer.createTransport(config.mail.transport);
    options.from = config.mail.from;
  }

  return {
    send : send
  };
};

function send(to, subject, html, callback) {
  var mailOptions = {
    from : options.from,
    to : to,
    subject : subject,
    html : html
  };

  transporter.sendMail(mailOptions, callback);
}
