var userModel_1 = require("../models/userModel");
var jwt = require("jsonwebtoken");
var errors_1 = require("../errors");
var config = require('../config');
var AuthController = (function () {
    function AuthController() {
    }
    /**
     * Checks for given email, which serves as username and needs to be unique and a password.
     * When a matching entry is found it returns the token for the user which expires
     * after a given time.
     * The token also includes the userID and his role.
     * @param request ?email=&password=
     * @param response
     * @param next
     * @returns {Promise<*>}
     */
    AuthController.async = authenticate(request, response, next);
    return AuthController;
})();
exports.AuthController = AuthController;
{
    if (!request.body.email) {
        return next(new errors_1.ErrorREST(errors_1.Errors.BadRequest, "User name missing."));
    }
    else if (!request.body.password) {
        return next(new errors_1.ErrorREST(errors_1.Errors.BadRequest, "Password missing."));
    }
    userModel_1.User.findOne({ email: request.body.email }).then(processData).catch(next);
    function processData(user) {
        if (!user) {
            return next(new errors_1.ErrorREST(errors_1.Errors.Unauthorized, "User does not exist."));
        }
        else {
            var passwordCorrect = user.password === request.body.password;
            if (!passwordCorrect) {
                return next(new errors_1.ErrorREST(errors_1.Errors.Unauthorized, "Wrong password."));
            }
            else {
                var payload = {
                    email: user.email,
                    role: user.role,
                    userID: user._id,
                    userNameFirst: user.name_first,
                    userNameLast: user.name_last
                };
                response.status(200).json({
                    status: 200,
                    message: "Request successful.",
                    role: user.role,
                    userID: user._id,
                    userNameFirst: user.name_first,
                    userNameLast: user.name_last,
                    token: jwt.sign(payload, config.Config.salt, { expiresIn: 86400 }) //one week
                });
            }
        }
    }
}
//# sourceMappingURL=authController.js.map