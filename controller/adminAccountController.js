const ErrorREST = require('../errors').ErrorREST,
    Errors = require('../errors').Errors,
    modelUser = require('../models/userModel').user;


/**
 * todo
 * get all data from all users
 * permission: admin
 * @param request
 * @param response
 * @param next
 */
function getAllUsers(request, response, next){
    if (app.get('DEBUG') || request.decoded.role === 'admin') {
        modelUser.find().then(data => response.json(data)).catch(next);
    } else {
        return next(new ErrorREST(Errors.Forbidden));
    }
}

/**
 * todo
 * get all data from one user
 * permission: admin
 * @param request
 * @param response
 * @param next
 */
function getOneUser(request, response, next){
    let requestedUserID = request.params.id;
    let ownUserID =  request.decoded.userID;

    modelUser.findById(requestedUserID).then(
        user => {
            if(user) {
                response.status(200).json(user)
            } else {
                return next(new ErrorREST(Errors.NotFound, "User does not exist."));
            }
        }
    ).catch(next);
}

/**
 * For debug and testing, remove all users at once
 * permission: admin
 * @param request
 * @param response
 * @param next
 * @returns {*}
 */
function deleteAll(request, response, next) {
    if (app.get('DEBUG') || request.decoded.role === 'admin') {
        modelUser.deleteMany().then(data => response.json(data)).catch(next);
    } else {
        return next(new ErrorREST(Errors.Forbidden));
    }
}

/**
 * delete user by id in params
 * permission: admin
 * todo permission check
 * @param request
 * @param response
 * @param next
 */
function deleteUser(request, response, next){
    let requestedUserID = request.params.id;
    let ownUserID =  request.decoded.userID;

    modelUser.remove({_id: requestedUserID}).then(user => response.json({removedElements: user})).catch(next);
}


/**
 * todo
 * get a list of users with not activated accounts
 * permission: admin
 * @param request
 * @param response
 * @param next
 */
function getNotActivatedUsers(request, response, next) {
    //modelUser.find().then(data => response.json(data)).catch(next);

    response.status(Errors.NoContent.status).json({});
}

/**
 * todo
 * activate a specific users account
 * permission: admin
 * @param request
 * @param response
 * @param next
 */
function activateUser(request, response, next) {


    response.status(Errors.NoContent.status).json({});
}

/**
 * todo
 * get a list of disabled accounts
 * permission: admin
 * @param request
 * @param response
 * @param next
 */
function getDisabledUsers(request, response, next) {


    response.status(Errors.NoContent.status).json({});
}

/**
 * todo
 * disable or enable a specific user account
 * permission: admin
 * @param request
 * @param response
 * @param next
 */
function changeDisable(request, response, next) {


    response.status(Errors.NoContent.status).json({});
}

/**
 * todo
 * get a list of inactive accounts
 * permission: admin
 * @param request
 * @param response
 * @param next
 */
function getInactiveUsers(request, response, next) {


    response.status(Errors.NoContent.status).json({});
}


module.exports = {
    getAllUsers:getAllUsers,
    getOneUser:getOneUser,
    deleteAll: deleteAll,
    deleteUser:deleteUser,
    getNotActivatedUsers: getNotActivatedUsers,
    activateUser: activateUser,
    getDisabledUsers: getDisabledUsers,
    changeDisable: changeDisable,
    getInactiveUsers: getInactiveUsers
};