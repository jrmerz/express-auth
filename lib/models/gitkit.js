var GitkitClient = require('gitkitclient');
var fs = require('fs');
var gitkitClient;

module.exports = function(setup) {
  if( gitkitClient ) {
    return gitkitClient;
  }

  if( !setup ) {
    throw('gitkit module accessed before initialization');
  }

  if( typeof setup.config.gitkit === 'string' ) {
    setup.config.gitkit = JSON.parse(fs.readFileSync(setup.config.gitkit));
  }


  gitkitClient = new GitkitClient(setup.config.gitkit);
  return gitkitClient;
};
