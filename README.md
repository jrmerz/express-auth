# express-auth

Full authentication and authorization stack for ExpressJS built on:

 - http://passportjs.org/
 - https://github.com/optimalbits/node_acl
 - MongoDB

# Paths

express-auth adds the following API endpoints to the ExpressJS server.  Not /auth
is the default root but this can be modified in the config.

## /auth/isLoggedIn

Returns:
```
{loggedIn : Boolean}
```

## /auth/getUserInfo

Returns user object

## /auth/config

Returns the current server configuration.  This returns JavaScript code not JSON
and should be added as a script tag in your app.  Will inject the ExpressAuth
namespace describing the configuration for several of the web components.

## /auth/google

Login with google (if enabled).  /auth/google/callback will be the response endpoint.

## /auth/local

Login with username and password (local) account
