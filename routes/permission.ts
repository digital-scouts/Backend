import {ErrorREST, Errors} from "../errors";

import {Config} from "../config";

/**
 * Decodes the given path to json object from config
 * @param requestedPath
 * @returns {*}
 */
function decodePath(requestedPath:string[]):JSON {
    requestedPath.shift();
    requestedPath.shift();
    let path:JSON = JSON.parse(JSON.stringify(Config.permission));
    //console.log(path)
    requestedPath.forEach(function (item) {
        if (path[item]) {
           // console.log("___________decode: go for "+item+": ")
            //console.log(path[item])
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
function checkApiPermission(path:JSON, method:string, userRole:string) {
    let permissionList:string[] = path[method].users;
    //console.log(path[method].users)
    let find = permissionList.find(function (element) {
        console.log("___________Permission --> Suche:"+userRole+", Gefunden:"+ element + ", permission: "+ (element === userRole));
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
 *
 * @param request
 * @param response
 * @param next
 * @returns {*}
 */
export function checkPermission(request, response, next) {
    let userRole:string = request.decoded.role;
    let requestedUserID:string = request.params.id;
    let decodedPath:JSON = decodePath(request.originalUrl.split('/'));

    if(!checkApiPermission(decodedPath, request.method, userRole)){
        return next(new ErrorREST("Forbidden"));
    }

    if (requestedUserID != null) {
        checkPermissionLevel();
    }
    next();
}
