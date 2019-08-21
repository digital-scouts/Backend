var errors_1 = require("../errors");
var userModel_1 = require("../models/userModel");
var config_1 = require("../config");
/**
 * Decodes the given path to json object from config
 * @param requestedPath
 * @returns {*}
 */
function decodePath(requestedPath) {
    requestedPath.shift();
    requestedPath.shift();
    var path = JSON.parse(JSON.stringify(config_1.Config.permission));
    requestedPath.forEach(function (item) {
        item = item.split('?')[0];
        if (path[item]) {
            path = path[item];
        }
    });
    return path;
}
/**
 * todo add a disabled or notActivated check here
 * check if userRole from Request is permitted to execute this method on this path
 * @param path
 * @param method
 * @param userRole
 * @throws Errors.Forbidden
 */
function checkApiPermission(path, method, userRole) {
    var permissionList = null;
    try {
        permissionList = path[method].users;
    }
    catch (ex) {
        console.log("Can not get Permission for this route: " + JSON.stringify(path) + " | " + method);
        console.log("Did you configure it in config.js?");
        throw ex;
    }
    //console.log(path[method].users)
    var find = permissionList.find(function (element) {
        // console.log("___________Permission --> Suche:"+userRole+", Gefunden:"+ element + ", permission: "+ (element === userRole));
        return element === userRole;
    });
    return find !== undefined;
}
/**
 * todo
 * check if the user have the permission to execute the request.
 * maybe direct in method
 */
function checkPermissionLevel() {
}
/**
 * requested user
 * @param request
 * @param response
 * @param next
 * @returns {*}
 */
function checkPermission(request, response, next) {
    console.log('Skip Permission check:' + !config_1.Config.PERMISSION);
    if (!config_1.Config.PERMISSION) {
        next();
        return;
    }
    var userRole = request.decoded.role;
    var requestedUserID = request.decoded.userID;
    var decodedPath = decodePath(request.originalUrl.split('/'));
    if (!checkApiPermission(decodedPath, request.method, userRole)) {
    }
    var accountStatusCheckDone = false;
    userModel_1.User.findById(requestedUserID).then(function (user) {
        if (!(user && user.accountStatus.activated)) {
            return next(new errors_1.ErrorREST(errors_1.Errors.Forbidden, "Your account is not activated yet. Try again later."));
        }
        else if (!(user && !user.accountStatus.disabled)) {
            return next(new errors_1.ErrorREST(errors_1.Errors.Forbidden, "Your account is disabled. Contact our Leader for more information."));
        }
        accountStatusCheckDone = true;
    });
    if (requestedUserID != null) {
        checkPermissionLevel();
    }
    function checkFlag() {
        if (accountStatusCheckDone) {
            next();
        }
        else {
            setTimeout(checkFlag, 100);
        }
    }
    checkFlag();
}
exports.checkPermission = checkPermission;
//# sourceMappingURL=permission.js.map