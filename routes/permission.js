const ErrorREST = require('../errors').ErrorREST,
    Errors = require('../errors').Errors,
    user = require('../models/userModel').user;

/**
 *
 */
function hasPermission(string, request, response, next){
    let userID =  request.decoded.userID;

    user.findById(userID).then(processData).catch(next);

    function processData(user){
        if(!user) {
            return next(new ErrorREST(Errors.Unauthorized, "User does not exist."));
        } else {
            return next(new ErrorREST(Errors.Forbidden, "userID "+userID+" rolle: "+user.role+" hat keinen zugriff "+string));
        }
    }
}


module.exports = {
    hasPermission: hasPermission
};