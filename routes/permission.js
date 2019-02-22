const ErrorREST = require('../errors').ErrorREST,
    Errors = require('../errors').Errors,
    config = require('../config');

function checkPermission(request, response, next) {
    let requestedPath = request.originalUrl.split('/');//array ['','api','rest']
    let requestedMethod = request.method;
    let userRole = request.decoded.role;



    return next(new ErrorREST(Errors.Forbidden));
}

module.exports = {
    checkPermission: checkPermission
};