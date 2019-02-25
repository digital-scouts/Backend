import {ErrorREST, Errors} from "../errors";

import {Config} from "../config";

/**
 * todo
 * Decodes the given path to json object from config
 * @param requestedPath
 * @returns {*}
 */
function decodePath(requestedPath) {
    requestedPath.shift();
    requestedPath.shift();
    let path = Config.permission;
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
    let permissionList = path[method].users;
    let find = permissionList.find(function (element) {
        return element === userRole;
    });
    if(find === undefined){
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
export function checkPermission(request, response, next) {
    let userRole = request.decoded.role;
    let requestedUserID = request.params.id;
    let decodedPath = decodePath(request.originalUrl.split('/'));

    if(!checkApiPermission(decodedPath, request.method, userRole)){
        return next(new ErrorREST(Errors.Forbidden));
    }


    if (requestedUserID != null) {
        checkPermissionLevel();
    }

    next();
    //return next(new ErrorREST(Errors.Forbidden));
}
