var userModel_1 = require("../models/userModel");
var errors_1 = require("../errors");
var UserController = (function () {
    function UserController() {
    }
    /**
     * For debug and testing, show all users at once
     * todo move to AdminAccount
     * todo return only names and group
     * @param request
     * @param response
     * @param next
     * @returns {*}
     */
    UserController.getAll = function (request, response, next) {
        if (request.decoded) {
            userModel_1.User.find({ 'role': request.decoded.role }).then(function (data) { return response.json(data); }).catch(next);
        }
        else {
            userModel_1.User.find().then(function (data) { return response.json(data); }).catch(next);
        }
    };
    /**
     * add a new user to database
     * @param request
     * @param result
     * @param next
     * @returns {Promise<void>}
     */
    UserController.async = addUser(request, result, next);
    return UserController;
})();
exports.UserController = UserController;
{
    if (await)
        userModel_1.User.findOne({ email: request.body.email }).lean().exec();
    return next(new errors_1.ErrorREST(errors_1.Errors.Forbidden, "A user with the provided email already exists"));
    var user = new userModel_1.User(request.body);
    user.validate(function (err) {
        if (err)
            for (var errName in err.errors)
                if (err.errors[errName].name === 'ValidatorError')
                    return next(new errors_1.ErrorREST(errors_1.Errors.UnprocessableEntity, err.errors[errName].message));
    });
    await;
    user.save().then(function (user) { return result.status(200).json(user); }).catch(next);
}
setProfilePicture(request, response, next);
{
    response.status(errors_1.Errors.NoContent.status).json();
}
getUser(request, response, next);
{
    var requestedUserID = request.params.id;
    var ownUserID = request.decoded.userID;
    userModel_1.User.findById(requestedUserID, {
        name_first: 1,
        name_last: 1,
        image_profile: 1,
        role: 1
    }).then(function (user) {
        if (user) {
            response.status(200).json(user);
        }
        else {
            return next(new errors_1.ErrorREST(errors_1.Errors.NotFound, "User does not exist."));
        }
    }).catch(next);
}
updateEmail(request, response, next);
{
    response.status(errors_1.Errors.NoContent.status).json({});
}
updatePassword(request, response, next);
{
    response.status(errors_1.Errors.NoContent.status).json({});
}
updateUser(request, response, next);
{
    response.status(errors_1.Errors.NoContent.status).json({});
}
//# sourceMappingURL=userController.js.map