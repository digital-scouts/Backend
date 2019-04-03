import {ErrorREST, Errors} from "../errors";
import {User} from "../models/userModel";
import {Config} from "../config";

/**
 * Decodes the given path to json object from config
 * @param requestedPath
 * @returns {*}
 */
function decodePath(requestedPath: string[]): JSON {
    requestedPath.shift();
    requestedPath.shift();
    let path: JSON = JSON.parse(JSON.stringify(Config.permission));
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
 * todo add a disabled or notActivated check here
 * check if userRole from Request is permitted to execute this method on this path
 * @param path
 * @param method
 * @param userRole
 * @throws Errors.Forbidden
 */
function checkApiPermission(path: JSON, method: string, userRole: string) {
    let permissionList: string[] = null;
    try {
        permissionList = path[method].users;
    } catch (ex) {
        console.log("Can not get Permission for this route: " + path + " | " + method);
        console.log("Did you configure it in config.js?");
        throw ex;
    }

    //console.log(path[method].users)
    let find = permissionList.find(function (element) {
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
export function checkPermission(request, response, next) {
    if (!Config.PERMISSION) {
        next();
        return;
    }
    let userRole: string = request.decoded.role;
    let requestedUserID: string = request.decoded.userID;
    let decodedPath: JSON = decodePath(request.originalUrl.split('/'));

    if (!checkApiPermission(decodedPath, request.method, userRole)) {

    }

    let accountStatusCheckDone = false;

    User.findById(requestedUserID).then(user => {
        if (!(user && user.accountStatus.activated)) {
            return next(new ErrorREST(Errors.Forbidden, "Your account is not activated yet. Try again later."));
        } else if (!(user && !user.accountStatus.disabled)) {
            return next(new ErrorREST(Errors.Forbidden, "Your account is disabled. Contact our Leader for more information."));
        }
        accountStatusCheckDone = true;
    });

    if (requestedUserID != null) {
        checkPermissionLevel();
    }

    function checkFlag() {//wait wor async calls to finish
        if (accountStatusCheckDone) {
            next();
        } else {
            setTimeout(checkFlag, 100);
        }
    }

    checkFlag();
}
