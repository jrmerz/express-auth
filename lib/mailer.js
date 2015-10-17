var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter, options;

function init(config) {
  transporter = nodemailer.createTransport(config.mail.transport);
  options = config.mail.options;
}

function send(to, subject, html, callback) {
  var mailOptions = {
    from : options.from,
    to : to,
    subject : subject,
    html : html
  };

  transporter.sendMail(mailOptions, callback);
}
