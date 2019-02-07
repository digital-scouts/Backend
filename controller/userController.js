const modelUser = require('../models/userModel').user_woe,
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
 *
 * @param request
 * @param result
 * @param next
 * @returns {Promise<void>}
 */
async function addUser(request, result, next) {
    let user = await modelUser.findOne({email: request.body.email}).lean().exec();
    if (user) {
        return next(new ErrorREST(Errors.Forbidden, "A user with the provided email already exists"));
    }
    let newUser = new modelUser(request.body);
    await newUser.save().then(user => result.status(200).json(user)).catch(next);
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


module.exports = {
    getAll: getAll,
    addUser: addUser,
    deleteAll: deleteAll
};