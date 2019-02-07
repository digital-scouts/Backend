const jwt = require('jsonwebtoken'),
    ErrorREST = require('../errors').ErrorREST,
    Errors = require('../errors').Errors;

/**
 * This is just called by the router and checks the status of a given token.
 * @param request
 * @param response
 * @param next
 */
function verifyToken(request, response, next) {
    // Extract token from header / url parameters / post parameters
    let token = request.body.token || request.query.token || request.headers['x-access-token'];
    if (token) {
        /* TODO Decoded what...? */
        let functionProcessDecoded = function(error, decoded) {
            /* TODO What kind of errors are possible? */
            if (error) {
                return next(new ErrorREST(Errors.Unauthorized));
            }
            // Save to request for use in other routes
            request.decoded = decoded;
            next();
        };
        jwt.verify(
            token, app.get('salt'),
            functionProcessDecoded
        );
    } else {
        //return next(new ErrorREST(Errors.BadRequest, "Token required."));
        return next(new ErrorREST(Errors.Unauthorized));
    }
}

module.exports = {
    verifyToken: verifyToken
};