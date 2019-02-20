const user = require('../models/userModel').user,
    jwt = require('jsonwebtoken'),
    ErrorREST = require('../errors').ErrorREST,
    Errors = require('../errors').Errors;


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
async function authenticate(request, response, next) {
    if(!request.body.email) {
        return next(new ErrorREST(Errors.BadRequest, "User name missing."));
    } else if(!request.body.password) {
        return next(new ErrorREST(Errors.BadRequest, "Password missing."));
    }

    user.findOne({ email: request.body.email }).then(processData).catch(next);

    function processData(user) {
        if(!user) {
            return next(new ErrorREST(Errors.Unauthorized, "User does not exist."));
        } else {
            let passwordCorrect = user.password === request.body.password;

            if (!passwordCorrect) {
                return next(new ErrorREST(Errors.Unauthorized, "Wrong password."));
            } else {
                const payload = {
                    email: user.email,
                    role: user.role,
                    userID: user._id,
                    userNameFirst: user.name_first,
                    userNameLast:user.name_last
                };

                response.status(200).json(
                    {
                        status: 200,
                        message: "Request successful.",
                        token: jwt.sign(payload, app.get('salt'), { expiresIn: 604800 })//one week
                    }
                );
            }
        }
    }
}

module.exports = {
    authenticate: authenticate
};