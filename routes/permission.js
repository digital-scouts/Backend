const ErrorREST = require("../errors"),
    Errors = require("../errors"),
    Config = require("../config");

/**
 * todo
 * Decodes the given path to json object from config
 * @param requestedPath
 * @returns {*}
 */
function decodePath(requestedPath) {
    requestedPath.pop();
    requestedPath.pop();
    let path = Config.permission;
    requestedPath.forEach(function (item) {
        if (path[item]) {
            console.log('${item} has a path')
            path = path[item];
        }else{
            //todo isID?
            return new ErrorREST(Errors.NotFound);
        }
    });
    // console.log("________" + requestedPath )
    // console.log("________" + config.permission[requestedPath[2]][requestedPath[3]].permissionLevel )
    return "";
}

/**
 * todo
 * check if userRole from Request is permitted to execute this method on this path
 * @param path
 * @param method
 * @param userRole
 * @throws Errors.Forbidden
 */
function checkApiPermission(path, method, userRole) {
    //return next(new ErrorREST(Errors.Forbidden));
}

/**
 * todo
 * check if the user have the permission to execute the request.
 * maybe direct in method
 */
function checkPermissionLevel() {

}

/**
 *
 * @param request
 * @param response
 * @param next
 * @returns {*}
 */
function checkPermission(request, response, next) {
    let userRole = request.decoded.role;
    let requestedUserID = request.params.id;
    let decodedPath = decodePath(request.originalUrl.split('/'));

    checkApiPermission(decodedPath, request.method, userRole);

    if (requestedUserID != null) {
        checkPermissionLevel();
    }

    next();
    //return next(new ErrorREST(Errors.Forbidden));
}

module.exports = {
    checkPermission: checkPermission
};