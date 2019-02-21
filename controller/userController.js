const modelUser = require('../models/userModel').user,
    ErrorREST = require('../errors').ErrorREST,
    Errors = require('../errors').Errors;

/**
 * For debug and testing, show all users at once
 * todo move to adminAccount
 * todo return only names and group
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
 * todo set the profile picture
 * todo check if user has permission
 * @param request
 * @param response
 * @param next
 */
function setProfilePicture(request, response, next){
    response.status(Errors.NoContent.status);
}

/**
 * get user by id in params
 * todo permission check
 * todo return only names and group
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
 * todo send verification email to given email
 * todo confirm and update email in another method
 * @param request
 * @param response
 * @param next
 */
function updateEmail(request, response, next){


    response.status(Errors.NoContent.status);
}

/**
 * todo confirm old password, than update new password
 * @param request
 * @param response
 * @param next
 */
function updatePassword(request, response, next){


    response.status(Errors.NoContent.status);
}

/**
 * update everything in the user model except email and password
 * todo check witch data is given
 * todo update new data
 * @param request
 * @param response
 * @param next
 */
function updateUser(request, response, next){


    response.status(Errors.NoContent.status);
}


module.exports = {
    getAll: getAll,
    addUser: addUser,
    setProfilePicture:setProfilePicture,
    getUser:getUser,
    updateEmail:updateEmail,
    updatePassword:updatePassword,
    updateUser:updateUser
};
