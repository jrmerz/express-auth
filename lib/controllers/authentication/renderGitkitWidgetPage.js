var fs = require('fs');

module.exports = function(setup) {
  return function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var html = new Buffer(fs.readFileSync(setup.config.signInHTML || __dirname+'/gitkit-widget.html')).toString();
    html = html.replace('%%config%%', JSON.stringify(setup.config.signInWidget));
    html = html.replace('%%postBody%%', encodeURIComponent(req.body || ''));
    res.end(html);
  };
};
