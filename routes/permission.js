"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../errors");
var config_1 = require("../config");
/**
 * todo
 * Decodes the given path to json object from config
 * @param requestedPath
 * @returns {*}
 */
function decodePath(requestedPath) {
    requestedPath.shift();
    requestedPath.shift();
    var path = config_1.Config.permission;
    requestedPath.forEach(function (item, index) {
        if (path[item]) {
            path = path[item];
        }
    });
    return path;
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
    var permissionList = path[method].users;
    var find = permissionList.find(function (element) {
        return element === userRole;
    });
    if (find === undefined) {
        return false;
    }
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
    var userRole = request.decoded.role;
    var requestedUserID = request.params.id;
    var decodedPath = decodePath(request.originalUrl.split('/'));
    if (!checkApiPermission(decodedPath, request.method, userRole)) {
        return next(new errors_1.ErrorREST(errors_1.Errors.Forbidden));
    }
    if (requestedUserID != null) {
        checkPermissionLevel();
    }
    next();
    //return next(new ErrorREST(Errors.Forbidden));
}
exports.checkPermission = checkPermission;
