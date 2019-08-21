var jwt = require("jsonwebtoken");
var errors_1 = require("../errors");
var config = require('../config');
/**
 * This is just called by the router and checks the status of a given token.
 * @param request
 * @param response
 * @param next
 */
function verifyToken(request, response, next) {
    // Extract token from header / url parameters / post parameters
    var token = request.headers['x-access-token'] || request.headers['authorization'];
    if (token) {
        jwt.verify(token, config.Config.salt, function (error, decoded) {
            if (error) {
                return next(new errors_1.ErrorREST(errors_1.Errors.Unauthorized), "Token not valid: " + error);
            }
            // Save to request for use in other routes
            request.decoded = decoded;
            next();
        });
    }
    else {
        return next(new errors_1.ErrorREST(errors_1.Errors.Unauthorized), "Token required.");
    }
}
exports.verifyToken = verifyToken;
//# sourceMappingURL=token.js.map