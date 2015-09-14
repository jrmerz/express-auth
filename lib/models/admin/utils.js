function isAdminMiddleware(req, res, next) {
  utils.isAdmin(req, setup.acl, function(err, isAdmin){
    if( err ) {
      return utils.sendError(res, err);
    }

    if( !isAdmin ) {
      return utils.sendError(res, 'nope.');
    }

    next();
  });
}

module.exports = {
  isAdminMiddleware : isAdminMiddleware
};
