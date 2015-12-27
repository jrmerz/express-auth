var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter, options;

module.exports = function(config) {
  if( config ) {
    transporter = nodemailer.createTransport(config.mail.transport);
    options = config.mail.options;
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
