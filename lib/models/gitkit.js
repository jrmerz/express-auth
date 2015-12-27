var GitkitClient = require('gitkitclient');
var gitkitClient;

model.exports = function(setup) {
  if( gitkitClient ) {
    return gitkitClient;
  }

  if( !setup ) {
    throw('gitkit module accessed before initialization');
  }

  gitkitClient = new GitkitClient(JSON.parse(fs.readFileSync(setup.config.gitkit)));
  return gitkitClient;
};
