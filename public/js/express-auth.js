var ExpressAuth = {
  // root path for all requests, should be the same as 'path' in your
  // config file
  path : '/auth',

  // should contain an array of objects.  each object should have a
  // label and a path variable.  The label is the name to show on btn
  // the path is the location to redirect on click.
  oauthProviders : [],

  // should local logins be allowed?
  allowLocal : true

};
