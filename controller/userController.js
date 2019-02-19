const modelUser = require('../models/userModel').demoUser,
    ErrorREST = require('../errors').ErrorREST,
    Errors = require('../errors').Errors;

/**
 * For debug and testing, show all users at once
 * @param request
 * @param response
 * @param next
 * @returns {*}
 */
function getAll(request, response, next) {
    if (app.get('DEBUG') || request.decoded.role === 'admin') {
        modelUser.find().then(data => response.json(data)).catch(next);
    } else {
        return next(new ErrorREST(Errors.Forbidden));
    }
}

/**
 * add a new user to database
 * @param request
 * @param result
 * @param next
 * @returns {Promise<void>}
 */
async function addUser(request, result, next) {
    if (await modelUser.findOne({email: request.body.email}).lean().exec())
        return next(new ErrorREST(Errors.Forbidden, "A user with the provided email already exists"));

    let user = new modelUser(request.body);
    user.validate(err => {
        if (err)
            for (let errName in err.errors)
                if(err.errors[errName].name === 'ValidatorError')
                        return next(new ErrorREST(Errors.UnprocessableEntity,err.errors[errName].message))
    });
    await user.save().then(user => result.status(200).json(user)).catch(next);
}

/**
 * For debug and testing, remove all users at once
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
 * todo set the profile picture
 * todo check if user has permission
 * @param request
 * @param response
 * @param next
 */
function setProfilePicture(request, response, next){

}

/**
 * get user by id in params
 * todo permission check
 * @param request
 * @param response
 * @param next
 */
function getUser(request, response, next){
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
 * delete user by id in params
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


module.exports = {
    getAll: getAll,
    addUser: addUser,
    deleteAll: deleteAll,
    setProfilePicture:setProfilePicture,
    getUser:getUser,
    deleteUser:deleteUser
};
